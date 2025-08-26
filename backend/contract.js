const { ethers } = require("ethers");

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL || "https://sepolia.base.org";

const CONTRACT_ABI = [
	"function createGiveaway(string transactionId, uint256 amountPerUser, uint256 maxRecipients, uint256 duration) payable",
	"function claimReward(string transactionId, string twitterId, address recipient)",
	"function cancelGiveaway(string transactionId)",
	"function getGiveawayInfo(string transactionId) view returns (address, uint256, uint256, uint256, uint256, uint256, bool)",
	"function hasClaimed(string transactionId, string twitterId) view returns (bool)",
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

module.exports = { contract, ethers };
