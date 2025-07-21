
# 🌱 GreenChain - AI-Powered On-Chain Reforestation Platform

A fully on-chain social platform on the Internet Computer for real-time tracking and investment in reforestation projects. Powered by fine-tuned AI models, predicting forest health and CO₂ sequestration to generate transparent, traceable carbon impact tokens.

![GreenChain Platform](https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=400&fit=crop&crop=center)

## 🎯 Platform Overview

GreenChain bridges AI, RWA (Real World Assets), and blockchain technology to create a transparent, social, and scalable reforestation investment platform. From £0.01 to £1M+ investments, our platform democratizes climate action through:

- **AI-Verified Forest Monitoring**: Real-time satellite data and ML models
- **Social Investment Platform**: Community-driven reforestation projects
- **Transparent Carbon Credits**: Blockchain-verified CO₂ sequestration tracking
- **Multi-Chain Integration**: Solana for speed, ICP for storage and social features

## ✨ Key Features

### 🎨 Brand Identity
- **GreenChain Logo**: Beautiful gradient logo with BeakerIcon (representing AI/science)
- **Tagline**: "AI-Powered Reforestation Platform"
- **Professional Design**: Modern, clean aesthetic matching the platform's mission

### 🧭 Navigation Elements
- **Projects**: Ecuador reforestation projects
- **Map**: Interactive project map view
- **Social**: Community social feed
- **Leaderboard**: Climate impact rankings
- **Challenges**: Community goals and rewards

### 🔍 Search Functionality
- **Global Search**: "Search projects, users, or content..."
- **Responsive Design**: Hidden on mobile, accessible via menu

### 🎯 Action Buttons
- **AI Agent**: Purple sparkles icon with pulsing indicator
- **Dark/Light Mode**: Theme toggle with smooth transitions
- **Notifications**: Bell icon with red badge counter
- **Messages**: Chat icon with blue badge counter

### 👤 User Profile Integration
- **Avatar with Level Badge**: Shows user level in purple circle
- **Impact Stats**: Carbon offset display in dropdown
- **Verification Badge**: Blue checkmark for verified users
- **Dropdown Menu**: Profile, investments, settings, logout

### 📱 Mobile Responsive
- **Hamburger Menu**: Clean mobile navigation
- **Touch-Friendly**: Optimized for mobile interactions
- **Consistent UX**: Same features across all devices

## 🚀 Technology Stack

### Frontend
- **Next.js 15**: React framework with TypeScript
- **Tailwind CSS**: Utility-first styling
- **Heroicons**: Beautiful icon library
- **Framer Motion**: Smooth animations
- **Zustand**: State management
- **React Hot Toast**: Notifications

### Blockchain Integration
- **Solana**: High-speed transactions and wallet integration
- **Anchor Framework**: Solana smart contract development
- **SPL Tokens**: Carbon credit tokenization
- **Wallet Adapters**: Phantom, Solflare, and more

### Smart Contract Features
- **Platform Management**: Fee collection and governance
- **Project Creation**: Decentralized project listing
- **Investment Tracking**: Transparent funding records
- **Carbon Credit Minting**: Automated token issuance
- **User Profiles**: On-chain social profiles
- **AI Integration**: Prediction score storage

### Future ICP Integration
- **Canister Storage**: Large-scale data storage
- **Social Features**: Community interactions
- **Identity Management**: Internet Identity integration

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- Solana CLI tools
- Anchor Framework
- Git

### 1. Clone Repository
```bash
git clone https://github.com/your-org/greenchain-platform.git
cd greenchain-platform
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install Solana program dependencies
cd solana-program
cargo build-bpf
cd ..
```

### 3. Environment Setup
```bash
# Copy environment variables
cp .env.example .env.local

# Update with your configuration
# NEXT_PUBLIC_PLATFORM_AUTHORITY=your_solflare_wallet_address
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the platform.

## 🏗️ Smart Contract Deployment

### 1. Setup Solana Environment
```bash
# Set to devnet for testing
solana config set --url devnet

# Create/import your wallet
solana-keygen new --outfile ~/.config/solana/id.json

# Get some devnet SOL
solana airdrop 2
```

### 2. Build and Deploy
```bash
cd solana-program

# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Run deployment script
cd scripts
ts-node deploy.ts
```

### 3. Update Frontend Configuration
After deployment, update `.env.local` with the deployed contract addresses:
```bash
NEXT_PUBLIC_PROGRAM_ID=your_deployed_program_id
NEXT_PUBLIC_PLATFORM_STATE=your_platform_state_pda
NEXT_PUBLIC_CARBON_TOKEN_MINT=your_carbon_token_mint
```

## 💰 Solana Integration

### Wallet Configuration
The platform supports multiple Solana wallets:
- **Phantom**: Most popular Solana wallet
- **Solflare**: Your configured wallet address
- **Torus**: Social login wallet
- **Ledger**: Hardware wallet support

### Your Wallet Address
Configure your Solflare wallet with address:
```
63Gv5H8L2rZx1pHnTmJ58fWwiMyRUAN9zY3SFMkcwK3Z
```

### Smart Contract Functions
- `initialize_platform`: Setup platform parameters
- `create_project`: List new reforestation projects
- `invest_in_project`: Make investments with automatic fee handling
- `update_project_progress`: AI-verified tree planting updates
- `claim_carbon_credits`: Mint carbon credit tokens
- `update_user_profile`: Social profile management

## 🧪 Testing

### Frontend Testing
```bash
# Run component tests
npm test

# Run e2e tests
npm run test:e2e
```

### Smart Contract Testing
```bash
cd solana-program

# Run anchor tests
anchor test

# Run specific test
anchor test --skip-deploy tests/greenchain.ts
```

## 🌍 Platform Features

### Investment Flow
1. **Browse Projects**: View AI-scored reforestation projects
2. **Connect Wallet**: Solflare or other supported wallets
3. **Make Investment**: From £0.01 to £1M+ with automatic fee handling
4. **Track Progress**: Real-time updates with AI verification
5. **Claim Credits**: Receive carbon credit tokens upon completion

### Social Features
- **User Profiles**: Showcase your climate impact
- **Leaderboards**: Compete in environmental challenges
- **Social Feed**: Share updates and achievements
- **Messaging**: Direct communication with project creators
- **Notifications**: Real-time updates on investments

### AI Integration
- **Forest Health Prediction**: ML models analyze satellite data
- **Risk Assessment**: Project success probability scoring
- **Progress Verification**: Automated tree counting and health monitoring
- **Carbon Calculation**: Precise CO₂ sequestration estimates

## 🔐 Security Features

- **Multi-signature Support**: Enhanced security for large investments
- **Program Derived Addresses**: Secure account management
- **Access Controls**: Role-based permissions
- **Audit Trail**: Complete transaction history
- **Rate Limiting**: Protection against spam and abuse

## 📊 Analytics & Monitoring

### Platform Metrics
- Total CO₂ offset tracked
- Trees planted and verified
- Projects funded and completed
- User engagement statistics
- Investment volume and trends

### Real-time Dashboards
- Project progress monitoring
- Carbon credit issuance tracking
- User activity analytics
- Financial performance metrics

## 🔮 Roadmap

### Phase 1: MVP Launch ✅
- [x] Complete navbar with all features
- [x] Solana smart contract deployment
- [x] Wallet integration
- [x] Basic investment functionality

### Phase 2: Enhanced Features
- [ ] ICP canister integration
- [ ] Advanced AI monitoring
- [ ] Mobile app development
- [ ] Multi-language support

### Phase 3: Scale & Expand
- [ ] Additional blockchain networks
- [ ] Institutional investor features
- [ ] Carbon marketplace
- [ ] Global project expansion

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Guidelines
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.greenchain.eco](https://docs.greenchain.eco)
- **Discord**: [Join our community](https://discord.gg/greenchain)
- **Email**: support@greenchain.eco
- **Twitter**: [@GreenChainEco](https://twitter.com/GreenChainEco)

## 🙏 Acknowledgments

- Solana Foundation for blockchain infrastructure
- Internet Computer for decentralized storage
- OpenAI for AI model development
- The global reforestation community

---

**Built with 💚 for a sustainable future**

Transform climate action through technology. Every investment counts, every tree matters.

[🌱 Start Your Climate Journey](https://greenchain.eco)
