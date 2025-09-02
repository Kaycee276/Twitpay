import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, Clock, Gift, Copy, ExternalLink } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import LoadingSpinner from "../components/dashboard/LoadingSpinner";

interface Transaction {
	id: string;
	creator_username: string;
	token: string;
	amount_per_user: number;
	keywords: string[];
	expires_at: string;
	receiver: string | null;
	total_amount: number;
	max_recipients: number | null;
	status: string;
	claim_link: string;
	created_at: string;
	isExpired: boolean;
}

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:4000";

const ClaimPage = () => {
	const { transactionId } = useParams<{ transactionId: string }>();
	const navigate = useNavigate();

	const [transaction, setTransaction] = useState<Transaction | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [copiedId, setCopiedId] = useState(false);
	const [copiedKeywords, setCopiedKeywords] = useState(false);

	useEffect(() => {
		fetchTransaction();
	}, [transactionId]);

	const fetchTransaction = async () => {
		try {
			const response = await fetch(
				`${API_URL}/api/transactions/${transactionId}`
			);
			if (!response.ok) {
				throw new Error("Transaction not found");
			}
			const data = await response.json();
			setTransaction(data);

			// Copy transaction ID to clipboard
			if (data.id) {
				navigator.clipboard.writeText(data.id).catch(() => {
					console.log("Could not copy transaction ID to clipboard");
				});
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to load transaction"
			);
		} finally {
			setLoading(false);
		}
	};

	const copyToClipboard = async (text: string, type: "id" | "keywords") => {
		try {
			await navigator.clipboard.writeText(text);
			if (type === "id") {
				setCopiedId(true);
				setTimeout(() => setCopiedId(false), 2000);
			} else {
				setCopiedKeywords(true);
				setTimeout(() => setCopiedKeywords(false), 2000);
			}
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	const generateTwitterPost = () => {
		if (!transaction) return "";

		const keywords = transaction.keywords.join(" ");
		const postText = `Claiming my ${
			transaction.amount_per_user
		} ${transaction.token.toUpperCase()} from @${
			transaction.creator_username
		}! ${keywords}`;
		return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
			postText
		)}`;
	};

	const handleGoToTwitter = () => {
		const twitterUrl = generateTwitterPost();
		window.open(twitterUrl, "_blank");
	};

	const handleGoToDashboard = () => {
		navigate("/dashboard");
	};

	const formatAmount = (amount: number) => {
		return amount.toFixed(4);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	const isClaimable = () => {
		if (!transaction) return false;
		return transaction.status === "active" && !transaction.isExpired;
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	if (error && !transaction) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
				<div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
					<XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
					<h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
					<p className="text-gray-300">{error}</p>
				</div>
			</div>
		);
	}

	if (!transaction) return null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
			<motion.div
				className="bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 w-full max-w-md"
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
			>
				<div className="text-center mb-6">
					<Gift className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
					<h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
						Claim Your Tokens
					</h1>
					<p className="text-gray-300 mt-2">
						From @{transaction.creator_username}
					</p>
				</div>

				<div className="space-y-4 mb-6">
					<div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
						<h3 className="font-semibold text-gray-200 mb-2">
							Transaction Details
						</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-400">Token:</span>
								<span className="text-white font-medium">
									{transaction.token.toUpperCase()}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-400">Amount:</span>
								<span className="text-white font-medium">
									{formatAmount(transaction.amount_per_user)}{" "}
									{transaction.token.toUpperCase()}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-400">Expires:</span>
								<span className="text-white">
									{formatDate(transaction.expires_at)}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-gray-400">Transaction ID:</span>
								<div className="flex items-center gap-2">
									<span className="text-white font-mono text-xs">
										{transaction.id.slice(0, 8)}...
									</span>
									<button
										onClick={() => copyToClipboard(transaction.id, "id")}
										className="text-cyan-400 hover:text-cyan-300 transition-colors"
										title="Copy Transaction ID"
									>
										<Copy className="w-4 h-4" />
									</button>
									{copiedId && (
										<span className="text-green-400 text-xs">Copied!</span>
									)}
								</div>
							</div>
							{transaction.receiver && (
								<div className="flex justify-between">
									<span className="text-gray-400">For:</span>
									<span className="text-white">{transaction.receiver}</span>
								</div>
							)}
						</div>
					</div>

					<div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
						<h3 className="font-semibold text-gray-200 mb-2">Keywords</h3>
						<div className="flex flex-wrap gap-2 mb-3">
							{transaction.keywords.map((keyword, index) => (
								<span
									key={index}
									className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-sm"
								>
									{keyword}
								</span>
							))}
						</div>
						<button
							onClick={() =>
								copyToClipboard(transaction.keywords.join(" "), "keywords")
							}
							className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
						>
							<Copy className="w-3 h-3" />
							{copiedKeywords ? "Copied keywords!" : "Copy all keywords"}
						</button>
					</div>

					{transaction.isExpired && (
						<div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
							<Clock className="w-8 h-8 text-red-400 mx-auto mb-2" />
							<p className="text-red-400 font-medium">
								This transaction has expired
							</p>
						</div>
					)}

					{transaction.status !== "active" && (
						<div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-center">
							<XCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
							<p className="text-yellow-400 font-medium">
								This transaction is no longer active
							</p>
						</div>
					)}
				</div>

				{isClaimable() ? (
					<div className="space-y-4">
						<div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
							<h3 className="text-blue-400 font-medium mb-2">How to Claim:</h3>
							<ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
								<li>Click "Post on Twitter" below</li>
								<li>Post the pre-filled tweet</li>
								<li>Copy the URL of your tweet</li>
								<li>Copy your Transaction ID</li>
								<li>
									Return to dashboard and click "Verify Tweet" to paste your
									tweet URL and Transaction ID
								</li>
							</ol>
						</div>

						<div className="space-y-3">
							<button
								onClick={handleGoToTwitter}
								className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg py-3 font-medium hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2"
							>
								<FaXTwitter className="w-5 h-5" />
								Post on Twitter
								<ExternalLink className="w-4 h-4" />
							</button>

							<button
								onClick={handleGoToDashboard}
								className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 rounded-lg py-3 font-medium hover:bg-white/20 transition-all"
							>
								Go to Dashboard to Complete Claim
							</button>
						</div>
					</div>
				) : (
					<div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
						<XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
						<p className="text-red-400 font-medium">
							This transaction is not available for claiming
						</p>
					</div>
				)}
			</motion.div>
		</div>
	);
};

export default ClaimPage;
