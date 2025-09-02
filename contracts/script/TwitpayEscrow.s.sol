// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {TwitpayEscrow} from "../src/TwitpayEscrow.sol";

contract TwitpayEscrowScript is Script {
    TwitpayEscrow public escrow;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        
         escrow = new TwitpayEscrow(0xD271f92c9216f7b6918881e2d89573b3805c4866);

        vm.stopBroadcast();
    }
}
