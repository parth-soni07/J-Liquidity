// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LiquidityVault
 * @dev Implementation of a tokenized vault following ERC4626 standard
 */
contract JIL_Vault is ERC4626, ReentrancyGuard, Pausable, Ownable {
    using Math for uint256;

    // Events
    event PerformanceFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeesCollected(uint256 amount);

    // State variables
    address public JIL ;
    uint256 public performanceFee; // Fee in basis points (1/10000)
    uint256 public constant MAX_FEE = 1000; // Maximum 10% fee

    /**
     * @dev Constructor
     * @param asset_ The underlying token address
     * @param name_ Name of the vault token
     * @param symbol_ Symbol of the vault token
     */
    constructor(
        IERC20 asset_,
        string memory name_,
        string memory symbol_
    ) ERC4626(asset_) ERC20(name_, symbol_) Ownable(msg.sender) {
        performanceFee = 100; // 1% default fee
    }

    /**
     * @dev Deposit assets and mint vault tokens
     * @param assets Amount of assets to deposit
     * @param receiver Address receiving the vault tokens
     */
    function deposit(uint256 assets, address receiver) 
        public 
        virtual 
        override 
        nonReentrant 
        whenNotPaused 
        returns (uint256) 
    {
        require(assets > 0, "Cannot deposit 0 assets");
        require(receiver != address(0), "Invalid receiver");

        uint256 shares = previewDeposit(assets);
        require(shares > 0, "Cannot mint 0 shares");

        // Transfer assets from depositor
        IERC20(asset()).transferFrom(msg.sender, address(this), assets);

        _mint(receiver, shares);
        
        emit Deposit(msg.sender, receiver, assets, shares);
        return shares;
    }

    /**
     * @dev Withdraw assets by burning vault tokens
     * @param assets Amount of assets to withdraw
     * @param receiver Address receiving the assets
     * @param owner Owner of the vault tokens
     */
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public virtual override nonReentrant whenNotPaused returns (uint256) {
        require(assets > 0, "Cannot withdraw 0 assets");
        require(receiver != address(0), "Invalid receiver");

        uint256 shares = previewWithdraw(assets);

        if (msg.sender != owner) {
            _spendAllowance(owner, msg.sender, shares);
        }

        _burn(owner, shares);
        
        // Calculate and deduct performance fee
        uint256 feeAmount = (assets * performanceFee) / 10000;
        uint256 netAmount = assets - feeAmount;
        
        // Transfer assets to receiver
        IERC20(asset()).transfer(receiver, netAmount);
        
        emit Withdraw(msg.sender, receiver, owner, assets, shares);
        return shares;
    }

    /**
     * @dev Update performance fee
     * @param newFee New fee in basis points
     */
    function setPerformanceFee(uint256 newFee) external onlyOwner {
        require(newFee <= MAX_FEE, "Fee too high");
        emit PerformanceFeeUpdated(performanceFee, newFee);
        performanceFee = newFee;
    }

    /**
     * @dev Collect accumulated fees
     */
    function collectFees() external onlyOwner {
        uint256 balance = IERC20(asset()).balanceOf(address(this));
        uint256 totalSupplyValue = totalAssets();
        uint256 fees = balance - totalSupplyValue;
        
        require(fees > 0, "No fees to collect");
        
        IERC20(asset()).transfer(owner(), fees);
        emit FeesCollected(fees);
    }

    function transferasset(address to ,uint256 amount) public onlyJIL {
        IERC20(asset()).transfer(to,amount);
    }

    /**
     * @dev Pause deposits and withdrawals
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Resume deposits and withdrawals
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    function setJIL(address newJIL) public onlyOwner{
        JIL = newJIL;
    }
    modifier onlyJIL() {
        require(msg.sender == JIL);
        _;
    }

    /**
     * @dev Override totalAssets to account for fees
     */
    function totalAssets() public view virtual override returns (uint256) {
        return IERC20(asset()).balanceOf(address(this));
    }
}