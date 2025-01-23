// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./JIL_Vault.sol";

import {IGmpReceiver} from "./interfaces/IGmpReceiver.sol";
import {IGateway} from "./interfaces/IGateway.sol";


interface IJustInLiquidityReceiver {
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool);
}

contract CrossChainJustInLiquidity is ReentrancyGuard, Pausable, Ownable, IGmpReceiver {
    // Fixed fee of 0.3% (30 basis points)
    uint256 public constant PROTOCOL_FEE = 30; // 0.3% in basis points
    uint256 public constant GMP_GAS_LIMIT = 850_000;
    
    // Gateway contract interface
    IGateway public immutable gateway;
    
    // Enhanced mapping: networkId => token => vault
    mapping(uint16 => mapping(address => address)) public networkTokenVaults;
    
    // Mapping to track registered networks
    mapping(uint16 => bool) public registeredNetworks;

    // Cross-chain request structure with network information
    struct CrossChainRequest {
        uint16 sourceNetwork;
        uint16 destinationNetwork;
        address token;
        uint256 amount;
        address receiver;
        bytes params;
    }

    event VaultRegistered(
        uint16 indexed networkId,
        address indexed token,
        address indexed vault
    );

    event NetworkRegistered(
        uint16 indexed networkId
    );

    event CrossChainLiquidityRequested(
        uint16 sourceNetwork,
        uint16 destinationNetwork,
        address indexed receiver,
        address indexed token,
        uint256 amount,
        uint256 fee
    );

    event CrossChainLiquidityReceived(
        bytes32 indexed id,
        uint128 sourceChain,
        uint16 sourceNetwork,
        uint16 destinationNetwork,
        address indexed receiver,
        address indexed token,
        uint256 amount,
        uint256 fee
    );

    constructor(address _gateway) Ownable(msg.sender) {
        gateway = IGateway(_gateway);
    }

    // Function to register a network
    function registerNetwork(uint16 networkId) external onlyOwner {
        require(!registeredNetworks[networkId], "Network already registered");
        registeredNetworks[networkId] = true;
        emit NetworkRegistered(networkId);
    }

    // Enhanced vault registration for specific network
    function registerVault(
        uint16 networkId,
        address vault,
        address token
    ) public onlyOwner {
        require(registeredNetworks[networkId], "Network not registered");
        require(vault != address(0), "Invalid vault address");
        require(token != address(0), "Invalid token address");
        require(networkTokenVaults[networkId][token] == address(0), "Token already has a vault for this network");
        
        networkTokenVaults[networkId][token] = vault;
        emit VaultRegistered(networkId, token, vault);
    }

    // Function to register multiple vaults at once
    function registerVaults(
        uint16[] calldata networkIds,
        address[] calldata vaults,
        address[] calldata tokens
    ) external onlyOwner {
        require(networkIds.length == vaults.length && vaults.length == tokens.length, "Array lengths mismatch");
        
        for(uint i = 0; i < networkIds.length; i++) {
            registerVault(networkIds[i], vaults[i], tokens[i]);
        }
    }

    function removeVault(uint16 networkId, address token) external onlyOwner {
        require(networkTokenVaults[networkId][token] != address(0), "No vault registered for token in this network");
        delete networkTokenVaults[networkId][token];
    }

    function requestCrossChainLiquidity(
        uint16 sourceNetwork,
        uint16 destinationNetwork,
        address token,
        uint256 amount,
        address receiver,
        address destinationContract,
        bytes calldata params
    ) external payable nonReentrant whenNotPaused {
        
        // Calculate protocol fee
        uint256 fee = (amount * PROTOCOL_FEE) / 10000;
        
        // Prepare cross-chain request
        CrossChainRequest memory request = CrossChainRequest({
            sourceNetwork: sourceNetwork,
            destinationNetwork: destinationNetwork,
            token: token,
            amount: amount,
            receiver: receiver,
            params: params
        });
        
        // Encode the request data
        bytes memory payload = abi.encode(request);
        
        // Estimate GMP cost
        uint256 messageCost = gateway.estimateMessageCost(
            destinationNetwork,
            payload.length,
            GMP_GAS_LIMIT
        );
        require(msg.value >= messageCost, "Insufficient GMP fee");
        
        // Submit cross-chain message
        gateway.submitMessage{value: msg.value}(
            destinationContract,
            destinationNetwork,
            GMP_GAS_LIMIT,
            payload
        );
        
        emit CrossChainLiquidityRequested(
            sourceNetwork,
            destinationNetwork,
            receiver,
            token,
            amount,
            fee
        );
    }
    
    function onGmpReceived(
        bytes32 id,
        uint128 sourceChain,
        bytes32 source,
        bytes calldata payload
    ) external payable override returns (bytes32) {
        require(msg.sender == address(gateway), "Only gateway can call");
        
        // Decode the request
        CrossChainRequest memory request = abi.decode(payload, (CrossChainRequest));
        
        // Verify vault exists in destination network
        address vault = networkTokenVaults[request.destinationNetwork][request.token];
        require(vault != address(0), "No vault for token in destination network");
        
        // Calculate protocol fee
        uint256 fee = (request.amount * PROTOCOL_FEE) / 10000;
        
        // Transfer tokens from vault to receiver
        IERC20 token = IERC20(request.token);
        uint256 balanceBefore = token.balanceOf(vault);
        
        JIL_Vault(vault).transferasset(request.receiver, request.amount);
        
        // Execute receiver's logic
        require(
            IJustInLiquidityReceiver(request.receiver).executeOperation(
                request.token,
                request.amount,
                fee,
                tx.origin,
                request.params
            ),
            "Invalid operation execution"
        );
        
        // Verify repayment
        token.transfer(vault, token.balanceOf(address(this)));
        uint256 balanceAfter = token.balanceOf(vault);
        require(
            balanceAfter >= balanceBefore + fee,
            "Liquidity not repaid with fee"
        );
        
        emit CrossChainLiquidityReceived(
            id,
            sourceChain,
            request.sourceNetwork,
            request.destinationNetwork,
            request.receiver,
            request.token,
            request.amount,
            fee
        );
        
        return bytes32(0);
    }

    // Helper function to check if a vault exists for a network and token
    function hasVault(uint16 networkId, address token) external view returns (bool) {
        return networkTokenVaults[networkId][token] != address(0);
    }

    // Get vault address for a specific network and token
    function getVault(uint16 networkId, address token) external view returns (address) {
        return networkTokenVaults[networkId][token];
    }

    function requestCrossChainLiquidityCost(
        uint16 sourceNetwork,
        uint16 destinationNetwork,
        address token,
        uint256 amount,
        address receiver,
        address destinationContract,
        bytes calldata params
    ) public view returns(uint256) {
        
        // Prepare cross-chain request with network information
        CrossChainRequest memory request = CrossChainRequest({
            sourceNetwork: sourceNetwork,
            destinationNetwork: destinationNetwork,
            token: token,
            amount: amount,
            receiver: receiver,
            params: params
        });
        
        // Encode the request data
        bytes memory payload = abi.encode(request);
        
        // Calculate the message cost
        uint256 messageCost = gateway.estimateMessageCost(
            destinationNetwork,
            payload.length,
            GMP_GAS_LIMIT
        );
        
        return messageCost;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}


/*


    sepolia 
    JIT 0xD290b0de1a026D4b89e9BA69d5f3aF02385aEe71
    Vault 0x0471153a251DF317BcA00FBa33d58b266Ca2e050
    token 0xB41a876bc59399f4500707E2edAa7b70a60c822f
    receiver 0xB934DB056abd075d77f48cFe58a089843C3E0279










*/