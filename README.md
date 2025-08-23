# TwitPay 🚀

A decentralized social payment platform that enables users to create and claim cryptocurrency giveaways through Twitter integration and blockchain technology.

## 🌟 Features

- **Twitter OAuth Integration**: Seamless login with Twitter accounts
- **Cryptocurrency Giveaways**: Create and manage token giveaways on Base network
- **Smart Contract Integration**: Automated giveaway distribution using Ethereum smart contracts
- **Real-time Activity Tracking**: Monitor transactions and claims in real-time
- **User Statistics**: Track giveaway performance and user engagement
- **Modern Web3 UI**: Beautiful, responsive interface with Tailwind CSS
- **Session Management**: Secure authentication with Express sessions

## 🛠 Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Wagmi** + **Viem** for Web3 integration
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend

- **Node.js** with Express
- **Passport.js** for Twitter OAuth
- **Supabase** for database
- **Ethers.js** for blockchain interaction
- **Express Sessions** for authentication
- **CORS** for cross-origin requests

### Blockchain

- **Base Network** (Sepolia testnet)
- **Smart Contracts** for giveaway management
- **Ethereum** for cryptocurrency transactions

## 📁 Project Structure

```
tweetpay/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand state management
│   │   ├── utils/          # Utility functions
│   │   ├── common/         # Common components and types
│   │   └── assets/         # Static assets
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # Node.js backend server
│   ├── index.js            # Main server file
│   ├── contract.js         # Smart contract integration
│   ├── supabase.js         # Database configuration
│   ├── supabase_schema.sql # Database schema
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Twitter Developer Account
- Supabase Account
- Base Network Wallet (for testing)

### Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories:

#### Backend (.env)

```env
# Twitter OAuth
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_CALLBACK_URL=http://localhost:4000/auth/twitter/callback
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

# Session
SESSION_SECRET=your_session_secret

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Blockchain
CONTRACT_ADDRESS=your_smart_contract_address
PRIVATE_KEY=your_wallet_private_key
RPC_URL=https://sepolia.base.org
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:4000
VITE_CONTRACT_ADDRESS=your_smart_contract_address
```

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tweetpay
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up the database**
   ```bash
   cd ../backend
   # Run the SQL schema in your Supabase dashboard
   # Or use Supabase CLI to apply the schema
   ```

### Running the Application

1. **Start the backend server**

   ```bash
   cd backend
   npm run dev  # Development mode with nodemon
   # or
   npm start    # Production mode
   ```

   The backend will run on `http://localhost:4000`

2. **Start the frontend application**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:4006`

## 🔗 API Endpoints

### Authentication

- `GET /auth/twitter` - Initiate Twitter OAuth
- `GET /auth/twitter/callback` - OAuth callback handler
- `GET /auth/status` - Check authentication status
- `POST /auth/logout` - Logout user

### Transactions

- `GET /api/activity` - Fetch user transaction activity
- `GET /api/stats` - Fetch user statistics
- `POST /api/transactions` - Create new giveaway
- `GET /api/transactions/:id` - Get transaction details

### Claims

- `POST /api/claims` - Submit claim for giveaway
- `GET /api/claims/:transactionId` - Get claims for transaction

## 🗄 Database Schema

### Tables

#### `twitter_users`

- `id` - Twitter user ID
- `username` - Twitter handle
- `display_name` - Display name
- `profile_image_url` - Profile picture URL
- `verified` - Twitter verification status

#### `transactions`

- `id` - Unique transaction ID
- `creator_id` - Creator's Twitter ID
- `creator_username` - Creator's username
- `token` - Token symbol/address
- `amount_per_user` - Amount per recipient
- `keywords` - Required keywords for claiming
- `expires_at` - Giveaway expiration
- `total_amount` - Total giveaway amount
- `max_recipients` - Maximum number of recipients
- `status` - Transaction status (active/completed/cancelled)

#### `claims`

- `id` - Unique claim ID
- `transaction_id` - Associated transaction
- `twitter_id` - Claimer's Twitter ID
- `twitter_username` - Claimer's username
- `amount` - Claimed amount
- `claimed_at` - Claim timestamp

## 🔧 Smart Contract Functions

The platform uses a smart contract with the following main functions:

- `createGiveaway()` - Create a new giveaway
- `claimReward()` - Claim rewards from a giveaway
- `cancelGiveaway()` - Cancel an active giveaway
- `getGiveawayInfo()` - Get giveaway details
- `hasClaimed()` - Check if user has already claimed

## 🎨 Key Features

### User Authentication

- Twitter OAuth 2.0 integration
- Session-based authentication
- Secure user data storage in Supabase

### Giveaway Management

- Create giveaways with custom parameters
- Set keywords for claiming requirements
- Automatic expiration handling
- Real-time status updates

### Web3 Integration

- Wallet connection with Wagmi
- Smart contract interactions
- Transaction signing and confirmation
- Gas fee optimization

### User Experience

- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Real-time activity feeds
- Intuitive navigation

## 🚀 Deployment

### Backend Deployment

1. Set up environment variables on your hosting platform
2. Deploy to platforms like Heroku, Railway, or Vercel
3. Configure CORS for your production domain

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar platforms
3. Update environment variables for production

### Database Setup

1. Create a Supabase project
2. Run the schema migration
3. Configure connection strings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Open an issue in the repository
- Check the documentation
- Contact the development team

## 🔮 Roadmap

- [ ] Multi-chain support
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Social features and sharing
- [ ] Integration with more social platforms
- [ ] Advanced giveaway types (lottery, contests)

---

**Built with ❤️ using modern web technologies and blockchain innovation**
