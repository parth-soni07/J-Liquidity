// 

pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RECEIVER {

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool){
        IERC20(asset).transfer(msg.sender,premium+amount);
        return true;
    }


}