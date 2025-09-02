const { ethers } = require("ethers");

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL || "https://sepolia.base.org";

const CONTRACT_ABI = [
	"function createBounty(uint256 expirationDuration, uint256 maxNumberOfRecipient, uint256 amountPerRecipient) payable",
	"function verifyRecipient(uint256 bountyId, address recipient)",
	"function claimEther(uint256 bountyId)",
	"function claimRefund(uint256 bountyId)",
	"function updateVerifier(address newVerifier)",
	"function getTransfer(uint256 bountyId) view returns (address, uint256, uint256, uint256, bool, uint256, uint256)",
	"function hasRecipientClaimed(uint256 bountyId, address recipient) view returns (bool)",
	"function isVerified(uint256 bountyId, address recipient) view returns (bool)",
	"function getCreatorTransfers(address creator) view returns (uint256[])",
	"function isBountyExpired(uint256 bountyId) view returns (bool)",
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

module.exports = { contract, ethers };
