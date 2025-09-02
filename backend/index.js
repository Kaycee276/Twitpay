require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const TwitterStrategy =
	require("@superfaceai/passport-twitter-oauth2").Strategy;
const cors = require("cors");
const { supabase } = require("./supabase");
const { contract, ethers } = require("./contract");

const app = express();
const PORT = process.env.PORT || 4000;

const bearerToken = process.env.TWITTER_BEARER_TOKEN;

// CORS setup (allow frontend dev server)
app.use(
	cors({
		origin: `${PORT}`,
		credentials: true,
	})
);

// Session setup
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	done(null, user);
});
passport.deserializeUser((obj, done) => {
	done(null, obj);
});

passport.use(
	new TwitterStrategy(
		{
			clientID: process.env.TWITTER_CLIENT_ID,
			clientSecret: process.env.TWITTER_CLIENT_SECRET,
			callbackURL: process.env.TWITTER_CALLBACK_URL,
			clientType: "confidential",
			authorizationURL: "https://twitter.com/i/oauth2/authorize",
			tokenURL: "https://api.twitter.com/2/oauth2/token",
		},
		async (accessToken, refreshToken, profile, done) => {
			// Here you could save user info to DB if needed
			try {
				const { id, username, displayName, photos, _json } = profile;
				const v2 = _json?.data || {};
				const handle = username || v2?.username;
				const profileImageUrl = photos?.[0]?.value || null;
				const verified = v2?.verified ?? false;

				// Upsert user into Supabase
				const { data, error } = await supabase.from("twitter_users").upsert(
					[
						{
							id,
							username: handle,
							display_name: displayName,
							profile_image_url: profileImageUrl,
							verified,
						},
					],
					{ onConflict: ["id"] }
				);
				if (error) {
					console.error("Supabase upsert error:", error);
				}
				return done(null, profile);
			} catch (error) {
				return done(error, null);
			}
		}
	)
);

// Auth routes
app.get(
	"/auth/twitter",
	passport.authenticate("twitter", {
		scope: ["users.read", "tweet.read", "offline.access"],
	})
);

app.get(
	"/auth/twitter/callback",
	passport.authenticate("twitter", { failureRedirect: "/" }),
	(req, res) => {
		// Successful authentication, redirect to dashboard
		res.redirect(`${PORT}/dashboard`);
	}
);

app.post("/auth/logout", (req, res) => {
	req.logout(() => {
		req.session.destroy(() => {
			res.clearCookie("connect.sid");
			res.json({ success: true });
		});
	});
});

// Check authentication status
app.get("/auth/status", (req, res) => {
	if (req.isAuthenticated()) {
		res.json({
			id: req.user.id,
			username: req.user.username || req.user._json?.data?.username,
			displayName: req.user.displayName,
			profileImageUrl:
				req.user.photos?.[0]?.value || req.user._json?.data?.profile_image_url,
			verified: req.user._json?.data?.verified || false,
		});
	} else {
		res.status(401).json({ error: "Not authenticated" });
	}
});

// Create transaction endpoint
app.post("/api/transactions", async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ error: "Not authenticated" });
	}

	try {
		const {
			token,
			amountPerUser,
			keywords,
			expiration,
			receiver,
			totalAmount,
			maxRecipients,
			// canStopEarly,
		} = req.body;

		// Validate required fields
		if (!token || !amountPerUser || !keywords || !expiration || !totalAmount) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		// Generate unique transaction ID and claim link
		const transactionId = `txn_${Date.now()}_${Math.random()
			.toString(36)
			.substr(2, 9)}`;
		const claimLink = `http://localhost:4006/claim/${transactionId}`;

		// Calculate expiration time
		const expiresAt = new Date();
		expiresAt.setHours(expiresAt.getHours() + parseInt(expiration));

		// Insert transaction into Supabase
		const { data: transaction, error } = await supabase
			.from("transactions")
			.insert([
				{
					id: transactionId,
					creator_id: req.user.id,
					creator_username: req.user.username,
					token,
					amount_per_user: amountPerUser,
					keywords: keywords.split(",").map((k) => k.trim()),
					expires_at: expiresAt,
					receiver: receiver || null,
					total_amount: totalAmount,
					max_recipients: maxRecipients || null,
					claim_link: claimLink,
					status: "active",
					created_at: new Date(),
				},
			])
			.select()
			.single();

		if (error) {
			console.error("Error creating transaction:", error);
			return res.status(500).json({ error: "Failed to create transaction" });
		}

		// Create giveaway on blockchain
		try {
			const durationInSeconds = parseInt(expiration) * 3600; // hours to seconds
			const amountInWei = ethers.parseEther(amountPerUser.toString());

			// For USDC, we need to handle it differently since it's an ERC-20 token
			if (token === "usdc") {
				// For now, we'll just log that this is a USDC transaction
				// In a real implementation, we would interact with the USDC contract
				console.log(
					"USDC transaction created - would interact with USDC contract here"
				);
			} else {
				// ETH transaction
				await contract.createBounty(
					transactionId,
					amountInWei,
					maxRecipients || 0,
					durationInSeconds,
					{ value: ethers.parseEther(totalAmount.toString()) }
				);
			}
		} catch (contractError) {
			console.error("Contract error:", contractError);
			// Continue without failing - contract is optional for now
		}

		res.json({
			success: true,
			transaction,
			claimLink,
		});
	} catch (error) {
		console.error("Transaction creation error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get transaction details for claim page
app.get("/api/transactions/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const { data: transaction, error } = await supabase
			.from("transactions")
			.select("*")
			.eq("id", id)
			.single();

		if (error || !transaction) {
			return res.status(404).json({ error: "Transaction not found" });
		}

		// Check if transaction is expired
		const isExpired = new Date(transaction.expires_at) < new Date();

		res.json({
			...transaction,
			isExpired,
		});
	} catch (error) {
		console.error("Error fetching transaction:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Claim transaction endpoint
app.post("/api/transactions/:id/claim", async (req, res) => {
	try {
		const { id } = req.params;
		const { twitterUsername, twitterId } = req.body;

		if (!twitterUsername || !twitterId) {
			return res
				.status(400)
				.json({ error: "Twitter username and ID required" });
		}

		// Get transaction details
		const { data: transaction, error: fetchError } = await supabase
			.from("transactions")
			.select("*")
			.eq("id", id)
			.single();

		if (fetchError || !transaction) {
			return res.status(404).json({ error: "Transaction not found" });
		}

		// Check if transaction is expired
		const isExpired = new Date(transaction.expires_at) < new Date();

		// Check if transaction is still active
		if (transaction.status !== "active") {
			return res.status(400).json({ error: "Transaction is no longer active" });
		}

		// Check if user has already claimed
		const { data: existingClaim } = await supabase
			.from("claims")
			.select("*")
			.eq("transaction_id", id)
			.eq("twitter_id", twitterId)
			.single();

		if (existingClaim) {
			return res
				.status(400)
				.json({ error: "You have already claimed this transaction" });
		}

		// Check if claiming is allowed (either transaction allows early claiming or it's expired)
		const canClaim = isExpired || transaction.can_stop_early;

		if (!canClaim) {
			// If claiming is not allowed, check if user is in whitelist
			const { data: whitelistEntry } = await supabase
				.from("whitelist")
				.select("*")
				.eq("transaction_id", id)
				.eq("twitter_id", twitterId)
				.single();

			if (!whitelistEntry) {
				return res
					.status(400)
					.json({ error: "You must verify your tweet before claiming" });
			}
		}

		// Check max recipients limit
		if (transaction.max_recipients) {
			const { count: claimsCount } = await supabase
				.from("claims")
				.select("*", { count: "exact", head: true })
				.eq("transaction_id", id);

			if (claimsCount >= transaction.max_recipients) {
				return res.status(400).json({ error: "Maximum recipients reached" });
			}
		}

		// Process claim
		const { data: claim, error: claimError } = await supabase
			.from("claims")
			.insert([
				{
					transaction_id: id,
					twitter_id: twitterId,
					twitter_username: twitterUsername,
					claimed_at: new Date(),
					amount: transaction.amount_per_user,
				},
			])
			.select()
			.single();

		if (claimError) {
			console.error("Error processing claim:", claimError);
			return res.status(500).json({ error: "Failed to process claim" });
		}

		// Update transaction status if all tokens are claimed
		const { count: totalClaims } = await supabase
			.from("claims")
			.select("*", { count: "exact", head: true })
			.eq("transaction_id", id);

		const totalClaimedAmount = totalClaims * transaction.amount_per_user;

		if (totalClaimedAmount >= transaction.total_amount) {
			await supabase
				.from("transactions")
				.update({ status: "completed" })
				.eq("id", id);
		}

		res.json({
			success: true,
			claim,
			message: "Successfully claimed tokens!",
		});
	} catch (error) {
		console.error("Claim processing error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Verify tweet endpoint
app.post("/api/verify", async (req, res) => {
	try {
		const { tweetUrl, transactionId } = req.body;

		if (!tweetUrl || !transactionId) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		// Get transaction details

		console.log("Verify request body:", req.body);

		const { data: transaction, error: fetchError } = await supabase
			.from("transactions")
			.select("*")
			.eq("id", transactionId)
			.single();

		console.log("Supabase transaction fetch result:", {
			transaction,
			fetchError,
		});

		if (fetchError || !transaction) {
			return res.status(404).json({ error: "Transaction not found" });
		}

		// Check if transaction is expired
		if (new Date(transaction.expires_at) < new Date()) {
			return res.status(400).json({ error: "Transaction has expired" });
		}

		// Check if transaction is still active
		if (transaction.status !== "active") {
			return res.status(400).json({ error: "Transaction is no longer active" });
		}

		// Check if user has already claimed
		const { data: existingClaim } = await supabase
			.from("claims")
			.select("*")
			.eq("transaction_id", transactionId)
			.eq("twitter_id", req.user.id)
			.single();

		if (existingClaim) {
			return res
				.status(400)
				.json({ error: "You have already claimed this transaction" });
		}

		function extractTweetId(tweetUrl) {
			const match = tweetUrl.match(/status\/(\d+)/);
			return match ? match[1] : null;
		}

		// Extract tweet ID from URL
		const tweetId = extractTweetId(tweetUrl);
		if (!tweetId) {
			return res.status(400).json({ error: "Invalid tweet URL" });
		}

		async function getTweetContent(tweetId) {
			const response = await fetch(
				`https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=text`,
				{
					headers: {
						Authorization: `Bearer ${bearerToken}`,
					},
				}
			);

			if (!response.ok) {
				const text = await response.text();

				console.error("Twitter API error:", text);
				throw new Error("Failed to fetch tweet content: " + text);
			}

			const data = await response.json();
			return data.data ? data.data.text : null;
		}

		// Verify tweet contains required keywords
		const tweetText = await getTweetContent(tweetId);

		if (!tweetText) {
			return res
				.status(400)
				.json({ error: "Could not retrieve tweet content" });
		}

		// const tweetTextLower = tweetText.toLowerCase();
		const keywords = (transaction.keywords || []).map((k) => k.toLowerCase());

		const missingKeywords = keywords.filter(
			(keyword) => !new RegExp(`\\b${keyword}\\b`, "i").test(tweetText)
		);

		if (missingKeywords.length > 0) {
			return res.status(400).json({
				error: `Tweet missing required keywords: ${missingKeywords.join(", ")}`,
			});
		}

		// Add user to whitelist
		const { data: whitelistEntry, error: whitelistError } = await supabase
			.from("whitelist")
			.insert([
				{
					transaction_id: transactionId,
					twitter_id: req.user.id,
					twitter_username: req.user.username,
					tweet_url: tweetUrl,
				},
			])
			.select()
			.maybeSingle();

		if (whitelistError) {
			console.error("Error adding to whitelist:", whitelistError);
			// Continue without failing - whitelist is optional for now
		}

		// Process claim
		const { data: claim, error: claimError } = await supabase
			.from("claims")
			.insert([
				{
					transaction_id: transactionId,
					twitter_id: req.user.id,
					twitter_username: req.user.username,
					claimed_at: new Date(),
					amount: transaction.amount_per_user,
				},
			])
			.select()
			.maybeSingle();

		if (claimError) {
			console.error("Error processing claim:", claimError);
			return res.status(500).json({ error: claimError.message });
		}

		// Update transaction status if all tokens are claimed
		const { count: totalClaims } = await supabase
			.from("claims")
			.select("*", { count: "exact", head: true })
			.eq("transaction_id", transactionId)
			.maybeSingle();

		const totalClaimedAmount = totalClaims * transaction.amount_per_user;

		if (totalClaimedAmount >= transaction.total_amount) {
			await supabase
				.from("transactions")
				.update({ status: "completed" })
				.eq("id", transactionId);
		}

		// Claim reward on blockchain
		try {
			await contract.claimReward(
				transactionId,
				req.user.id,
				"0x0000000000000000000000000000000000000000" // Replace with user's wallet address
			);
		} catch (contractError) {
			console.error("Contract claim error:", contractError);
			// Continue without failing - contract is optional for now
		}

		res.json({
			success: true,
			claim,
			message: "Tweet verified and tokens claimed successfully!",
		});
	} catch (error) {
		console.error("Verification error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/api/activity", async (req, res) => {
	try {
		if (!req.isAuthenticated()) {
			return res.status(401).json({ error: "Not authenticated" });
		}

		// Transactions created by the user
		const { data: createdTransactions, error: createdError } = await supabase
			.from("transactions")
			.select("id, token, status, created_at")
			.eq("creator_id", req.user.id)
			.order("created_at", { ascending: false })
			.limit(50);

		if (createdError) {
			console.error("Error fetching created transactions:", createdError);
			return res.status(500).json({ error: "Failed to fetch activity" });
		}

		// Claims made by the user (join to get token)
		const { data: userClaims, error: claimsError } = await supabase
			.from("claims")
			.select(
				"id, claimed_at, transaction_id, amount, transactions:transaction_id(id, token)"
			)
			.eq("twitter_id", req.user.id)
			.order("claimed_at", { ascending: false })
			.limit(50);

		if (claimsError) {
			console.error("Error fetching user claims:", claimsError);
			return res.status(500).json({ error: "Failed to fetch activity" });
		}

		const createdActivity = (createdTransactions || []).map((t) => ({
			type: `Created ${String(t.token || "").toUpperCase()}`,
			date: t.created_at,
			status: t.status || "active",
		}));

		const claimsActivity = (userClaims || []).map((c) => ({
			type: `Claimed ${String(c?.transactions?.token || "").toUpperCase()}`,
			date: c.claimed_at,
			status: "claimed",
		}));

		const activity = [...createdActivity, ...claimsActivity].sort((a, b) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		});

		return res.json(activity);
	} catch (error) {
		console.error("Activity fetch error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// Get user statistics
app.get("/api/stats", async (req, res) => {
	try {
		if (!req.isAuthenticated()) {
			return res.status(401).json({ error: "Not authenticated" });
		}

		// Get total transactions created by user
		const { count: totalTransactions, error: transactionsError } =
			await supabase
				.from("transactions")
				.select("*", { count: "exact", head: true })
				.eq("creator_id", req.user.id);

		if (transactionsError) {
			console.error("Error fetching transactions count:", transactionsError);
			return res.status(500).json({ error: "Failed to fetch stats" });
		}

		// Get total verified claims by user
		const { count: verifiedClaims, error: claimsError } = await supabase
			.from("claims")
			.select("*", { count: "exact", head: true })
			.eq("twitter_id", req.user.id);

		if (claimsError) {
			console.error("Error fetching claims count:", claimsError);
			return res.status(500).json({ error: "Failed to fetch stats" });
		}

		// Get active transactions count
		const { count: activeTransactions, error: activeError } = await supabase
			.from("transactions")
			.select("*", { count: "exact", head: true })
			.eq("creator_id", req.user.id)
			.eq("status", "active");

		if (activeError) {
			console.error("Error fetching active transactions:", activeError);
			return res.status(500).json({ error: "Failed to fetch stats" });
		}

		// Get completed transactions count
		const { count: completedTransactions, error: completedError } =
			await supabase
				.from("transactions")
				.select("*", { count: "exact", head: true })
				.eq("creator_id", req.user.id)
				.eq("status", "completed");

		if (completedError) {
			console.error("Error fetching completed transactions:", completedError);
			return res.status(500).json({ error: "Failed to fetch stats" });
		}

		const stats = {
			totalTransactions: totalTransactions || 0,
			verifiedClaims: verifiedClaims || 0,
			activeTransactions: activeTransactions || 0,
			completedTransactions: completedTransactions || 0,
		};

		return res.json(stats);
	} catch (error) {
		console.error("Stats fetch error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

app.listen(PORT, () => {
	console.log(`Backend server running on http://localhost:${PORT}`);
});
