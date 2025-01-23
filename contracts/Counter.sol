// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IGmpReceiver} from "./interfaces/IGmpReceiver.sol";
import {IGateway} from "./interfaces/IGateway.sol";
import {GmpSender, PrimitiveUtils} from "./interfaces/Primitives.sol";


contract Counter is IGmpReceiver {
    IGateway public _gateway = IGateway(0x000000007f56768dE3133034FA730a909003a165);
    uint256 public number;
    string public ANS;

    constructor() {
    }

    function onGmpReceived(bytes32, uint128, bytes32, bytes calldata data) external payable returns (bytes32) {
        // require(msg.sender == address(_gateway), "unauthorized");
        number++;
        ANS = abi.decode(data, (string));
        return bytes32(number);
    }

        function teleportCost() public view returns (uint256 deposit) {
        bytes memory message = abi.encode("Hey its working !!");
        return _gateway.estimateMessageCost(10, message.length, 850_000);
    }

        function teleport() external payable returns (bytes32 messageID) {
        bytes memory message = abi.encode("Hey its working !!");
        messageID = _gateway.submitMessage{value: msg.value}(address(this), 10, 850_000, message);
    }

}