# 🌱 GreenChain Platform - Complete Deployment Guide

This guide will help you deploy the complete GreenChain AI-powered reforestation platform with real smart contracts, AI integration, and production features.

## 📋 Prerequisites

### 1. System Requirements
```bash
# Node.js and npm
node --version  # v18.0.0 or higher
npm --version   # v9.0.0 or higher

# Rust and Cargo
rustc --version  # 1.70.0 or higher
cargo --version

# Git
git --version
```

### 2. Required Tools Installation

#### Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

#### Install Solana CLI
```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.18.18/install)"
export PATH="~/.local/share/solana/install/active_release/bin:$PATH"
```

#### Install Anchor CLI
```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

#### Install DFX (for ICP)
```bash
sh -c "$(curl -fsSL https://smartcontracts.org/install.sh)"
```

## 🔧 Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/AbdurRazzak01/OxyFi.git
cd OxyFi
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create `.env.local` file:
```bash
cp .env.example .env.local
```

Update with your API keys:
```env
# OpenAI API (Required for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Satellite Data APIs
SENTINEL_HUB_CLIENT_ID=your-sentinel-hub-client-id
SENTINEL_HUB_CLIENT_SECRET=your-sentinel-hub-client-secret

# Weather APIs
OPENWEATHER_API_KEY=your-openweather-api-key

# Optional: Database for caching
DATABASE_URL=postgresql://user:password@localhost:5432/greenchain
```

## 🚀 Deployment Steps

### Step 1: Setup Solana Wallet

#### Generate New Wallet (or use existing)
```bash
solana-keygen new --outfile ~/.config/solana/id.json
```

#### Configure Network
```bash
# For development
solana config set --url devnet

# For production
solana config set --url mainnet-beta
```

#### Fund Wallet (Devnet only)
```bash
solana airdrop 2
solana balance
```

### Step 2: Deploy Solana Smart Contract

#### Build the Program
```bash
cd solana-program
anchor build
```

#### Deploy to Devnet
```bash
# Set environment
export SOLANA_NETWORK=devnet

# Deploy
anchor deploy --provider.cluster devnet

# Run deployment script
cd scripts
ts-node deploy.ts
```

#### Deploy to Mainnet
```bash
# Set environment
export SOLANA_NETWORK=mainnet-beta

# Deploy (requires SOL for deployment fees)
anchor deploy --provider.cluster mainnet-beta

# Run deployment script
cd scripts
ts-node deploy.ts
```

### Step 3: Deploy ICP Canisters

#### Start Local DFX (for testing)
```bash
dfx start --background --clean
```

#### Deploy to Local Network
```bash
dfx deploy --network local
```

#### Deploy to IC Mainnet
```bash
# Create identity
dfx identity new production
dfx identity use production

# Deploy to mainnet
dfx deploy --network ic --with-cycles 1000000000000
```

### Step 4: Update Environment Variables

After successful deployment, update `.env.local`:
```env
# From Solana deployment output
NEXT_PUBLIC_PROGRAM_ID=your_deployed_program_id
NEXT_PUBLIC_PLATFORM_STATE=your_platform_state_pda
NEXT_PUBLIC_CARBON_TOKEN_MINT=your_carbon_token_mint
NEXT_PUBLIC_AI_ORACLE_AUTHORITY=your_ai_oracle_authority

# From ICP deployment output
NEXT_PUBLIC_ICP_CANISTER_ID=your_canister_id
```

### Step 5: Deploy Frontend

#### Build and Test Locally
```bash
npm run build
npm run start
```

#### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Deploy to Netlify
```bash
# Build for static export
npm run build
npm run export

# Upload dist folder to Netlify
```

## 🔍 Verification & Testing

### 1. Smart Contract Verification
```bash
# Check program deployment
solana program show YOUR_PROGRAM_ID

# Verify account creation
solana account YOUR_PLATFORM_STATE_PDA
```

### 2. Frontend Integration Test
```bash
# Start development server
npm run dev

# Open http://localhost:3000
# Test wallet connection
# Test project creation
# Test AI analysis
```

### 3. AI Integration Test
```bash
# Test AI endpoint
curl -X POST http://localhost:3000/api/ai/analyze-project \
  -H "Content-Type: application/json" \
  -d '{
    "projectData": {
      "id": "test-1",
      "location": {
        "latitude": -0.1807,
        "longitude": -78.4678,
        "areaHectares": 1000
      }
    }
  }'
```

## 🛠️ Production Configuration

### 1. Security Hardening
```bash
# Generate secure secrets
openssl rand -hex 32  # For JWT_SECRET
openssl rand -hex 32  # For ENCRYPTION_KEY
```

### 2. Database Setup (Optional)
```sql
-- PostgreSQL setup for caching
CREATE DATABASE greenchain;
CREATE USER greenchain_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE greenchain TO greenchain_user;
```

### 3. Monitoring Setup
```env
# Add to .env.local
SENTRY_DSN=your_sentry_dsn_for_error_tracking
ANALYTICS_API_KEY=your_analytics_key
```

## 📊 Post-Deployment Checklist

### ✅ Smart Contract Verification
- [ ] Program deployed successfully
- [ ] Platform state initialized
- [ ] Carbon token mint created
- [ ] Demo projects created
- [ ] AI oracle configured

### ✅ Frontend Verification
- [ ] Website loads correctly
- [ ] Wallet connection works
- [ ] Project creation functional
- [ ] Investment flow working
- [ ] AI recommendations displaying

### ✅ AI Integration Verification
- [ ] OpenAI API connected
- [ ] Forest analysis working
- [ ] Investment recommendations generating
- [ ] Anomaly detection functional

### ✅ ICP Integration Verification
- [ ] Canisters deployed
- [ ] Social features working
- [ ] Data storage functional
- [ ] Cross-chain coordination active

## 🚨 Troubleshooting

### Common Issues

#### 1. Solana Deployment Fails
```bash
# Check balance
solana balance

# Check network connection
solana cluster-version

# Rebuild and redeploy
anchor clean
anchor build
anchor deploy
```

#### 2. AI API Errors
```bash
# Check API key
echo $OPENAI_API_KEY

# Test API connection
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

#### 3. Frontend Build Errors
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install

# Rebuild
npm run build
```

#### 4. ICP Deployment Issues
```bash
# Check DFX status
dfx ping

# Reset and redeploy
dfx stop
dfx start --clean
dfx deploy
```

## 🔄 Updates and Maintenance

### Smart Contract Updates
```bash
# Update program
anchor build
anchor upgrade YOUR_PROGRAM_ID --program-keypair ~/.config/solana/id.json

# Update canisters
dfx deploy --mode upgrade
```

### Frontend Updates
```bash
# Deploy new version
git pull
npm install
npm run build
vercel --prod
```

## 📞 Support

### Resources
- **Documentation**: Check README.md files
- **Smart Contract**: `solana-program/` directory
- **Frontend**: `src/` directory
- **AI Services**: `src/services/aiService.ts`

### Getting Help
1. Check deployment logs
2. Verify environment variables
3. Test individual components
4. Review error messages carefully

---

**🎉 Congratulations!** Your GreenChain platform should now be fully deployed with:
- ✅ Solana smart contracts
- ✅ ICP canisters
- ✅ AI-powered forest analysis
- ✅ Real-time monitoring
- ✅ Production-ready frontend

The platform is ready to enable transparent, AI-verified reforestation investments! 🌱