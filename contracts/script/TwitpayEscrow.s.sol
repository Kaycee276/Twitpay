// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {TwitpayEscrow} from "../src/TwitpayEscrow.sol";

contract TwitpayEscrowScript is Script {
    TwitpayEscrow public escrow;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        
        // escrow = new TwitpayEscrow();

        vm.stopBroadcast();
    }
}
