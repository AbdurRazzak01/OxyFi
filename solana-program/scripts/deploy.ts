import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { 
  Connection, 
  Keypair, 
  PublicKey, 
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction
} from "@solana/web3.js";
import { 
  createMint, 
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  AuthorityType,
  setAuthority
} from "@solana/spl-token";
import { GreenChainReforestation } from "../target/types/greenchain_reforestation";
import fs from 'fs';
import path from 'path';

// Configuration
const NETWORK = process.env.SOLANA_NETWORK || "devnet";
const PLATFORM_AUTHORITY = "63Gv5H8L2rZx1pHnTmJ58fWwiMyRUAN9zY3SFMkcwK3Z";
const INVESTMENT_FEE_BPS = 250; // 2.5% platform fee
const MIN_AI_CONFIDENCE = 75; // Minimum 75% AI confidence required

async function main() {
  console.log("🌱 Deploying GreenChain Reforestation Platform to Solana", NETWORK);
  
  // Setup connection and provider
  const connection = new Connection(
    NETWORK === "devnet" 
      ? "https://api.devnet.solana.com"
      : NETWORK === "mainnet-beta"
      ? "https://api.mainnet-beta.solana.com"
      : "http://localhost:8899",
    "confirmed"
  );

  // Load or generate deployer wallet
  let deployerKeypair: Keypair;
  const keypairPath = path.join(process.env.HOME || '', '.config/solana/id.json');
  
  try {
    if (fs.existsSync(keypairPath)) {
      const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
      deployerKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
      console.log("✅ Loaded existing wallet from:", keypairPath);
    } else {
      deployerKeypair = Keypair.generate();
      console.log("⚠️  Generated new wallet. Save this keypair securely!");
      console.log("Public key:", deployerKeypair.publicKey.toString());
    }
  } catch (error) {
    console.log("Generating new keypair due to error:", error.message);
    deployerKeypair = Keypair.generate();
  }

  console.log("Deployer public key:", deployerKeypair.publicKey.toString());

  // Check and request SOL for devnet
  if (NETWORK === "devnet") {
    const balance = await connection.getBalance(deployerKeypair.publicKey);
    console.log("Current balance:", balance / LAMPORTS_PER_SOL, "SOL");
    
    if (balance < 2 * LAMPORTS_PER_SOL) {
      console.log("Requesting airdrop...");
      try {
        const airdropSignature = await connection.requestAirdrop(
          deployerKeypair.publicKey,
          2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(airdropSignature);
        console.log("✅ Airdrop confirmed");
      } catch (error) {
        console.log("⚠️  Airdrop failed:", error.message);
      }
    }
  }

  // Setup anchor provider
  const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(deployerKeypair),
    { commitment: "confirmed" }
  );
  anchor.setProvider(provider);

  // Load the program
  const program = anchor.workspace.GreenChainReforestation as Program<GreenChainReforestation>;
  console.log("Program ID:", program.programId.toString());

  try {
    // Step 1: Create Carbon Credit Token Mint
    console.log("\n🪙 Creating Carbon Credit Token Mint...");
    const carbonTokenMint = await createMint(
      connection,
      deployerKeypair,
      deployerKeypair.publicKey, // temporary mint authority
      null, // freeze authority
      6, // decimals (1 token = 1 kg CO2)
      undefined,
      undefined,
      TOKEN_PROGRAM_ID
    );
    console.log("✅ Carbon Token Mint:", carbonTokenMint.toString());

    // Step 2: Generate AI Oracle keypair
    const aiOracleKeypair = Keypair.generate();
    console.log("🤖 AI Oracle Authority:", aiOracleKeypair.publicKey.toString());

    // Step 3: Initialize Platform
    console.log("\n🏗️  Initializing Platform...");
    const [platformStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("platform")],
      program.programId
    );

    const platformAuthorityPubkey = new PublicKey(PLATFORM_AUTHORITY);

    const initTx = await program.methods
      .initializePlatform(
        platformAuthorityPubkey,
        carbonTokenMint,
        INVESTMENT_FEE_BPS,
        aiOracleKeypair.publicKey,
        MIN_AI_CONFIDENCE
      )
      .accounts({
        platformState: platformStatePDA,
        authority: deployerKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([deployerKeypair])
      .rpc();

    console.log("✅ Platform initialized. Transaction:", initTx);
    console.log("📍 Platform State PDA:", platformStatePDA.toString());

    // Step 4: Create Platform Fee Token Account
    console.log("\n💰 Creating Platform Fee Account...");
    const platformFeeAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      deployerKeypair,
      new PublicKey("So11111111111111111111111111111111111111112"), // WSOL mint
      platformAuthorityPubkey
    );
    console.log("✅ Platform Fee Account:", platformFeeAccount.address.toString());

    // Step 5: Transfer mint authority to platform
    console.log("\n🔐 Transferring mint authority to platform...");
    await setAuthority(
      connection,
      deployerKeypair,
      carbonTokenMint,
      deployerKeypair.publicKey,
      AuthorityType.MintTokens,
      platformStatePDA
    );
    console.log("✅ Mint authority transferred to platform");

    // Step 6: Create demo projects with enhanced AI data
    console.log("\n🌳 Creating Demo Projects...");
    
    const demoProjects = [
      {
        id: 1,
        name: "Amazon Rainforest Restoration",
        description: "Large-scale reforestation project in the Amazon rainforest focusing on native species restoration and biodiversity conservation with AI-powered monitoring.",
        location: {
          country: "Brazil",
          region: "Amazon Basin",
          latitude: -3.4653,
          longitude: -62.2159,
          areaHectares: 10000,
        },
        targetTrees: 100000,
        targetFunding: 1000000,
        carbonCreditRate: 25,
        aiPredictionData: {
          confidenceScore: 92,
          co2SequestrationRate: 28000,
          survivalProbability: 88,
          optimalSpecies: Array.from("Cecropia,Mahogany,Brazil Nut".padEnd(32, '\0')).map(c => c.charCodeAt(0)),
          climateSuitability: 95,
          soilQuality: 85,
          waterAvailability: 90,
        },
        verificationRequirements: {
          satelliteMonitoring: true,
          groundVerification: true,
          thirdPartyAudit: true,
          communityReporting: true,
          verificationFrequencyDays: 30,
        },
      },
      {
        id: 2,
        name: "Ecuador Cloud Forest Conservation",
        description: "Protecting and expanding cloud forest ecosystems in the Andes with real-time satellite monitoring and community involvement.",
        location: {
          country: "Ecuador",
          region: "Pichincha Province",
          latitude: -0.1807,
          longitude: -78.4678,
          areaHectares: 5000,
        },
        targetTrees: 50000,
        targetFunding: 500000,
        carbonCreditRate: 30,
        aiPredictionData: {
          confidenceScore: 89,
          co2SequestrationRate: 32000,
          survivalProbability: 91,
          optimalSpecies: Array.from("Cloud Forest Mix".padEnd(32, '\0')).map(c => c.charCodeAt(0)),
          climateSuitability: 88,
          soilQuality: 92,
          waterAvailability: 85,
        },
        verificationRequirements: {
          satelliteMonitoring: true,
          groundVerification: true,
          thirdPartyAudit: false,
          communityReporting: true,
          verificationFrequencyDays: 14,
        },
      },
    ];

    for (const projectData of demoProjects) {
      const [projectPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("project"), new anchor.BN(projectData.id).toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const createProjectTx = await program.methods
        .createProject(
          new anchor.BN(projectData.id),
          projectData.name,
          projectData.description,
          projectData.location,
          new anchor.BN(projectData.targetTrees),
          new anchor.BN(projectData.targetFunding),
          new anchor.BN(projectData.carbonCreditRate),
          projectData.aiPredictionData,
          projectData.verificationRequirements
        )
        .accounts({
          project: projectPDA,
          platformState: platformStatePDA,
          creator: deployerKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([deployerKeypair])
        .rpc();

      console.log(`✅ Created project "${projectData.name}"`);
      console.log(`   Transaction: ${createProjectTx}`);
      console.log(`   Project PDA: ${projectPDA.toString()}`);
    }

    // Step 7: Display deployment summary
    console.log("\n" + "=".repeat(80));
    console.log("🎉 DEPLOYMENT COMPLETE!");
    console.log("=".repeat(80));
    console.log(`🌐 Network: ${NETWORK}`);
    console.log(`🏗️  Program ID: ${program.programId.toString()}`);
    console.log(`🏛️  Platform State: ${platformStatePDA.toString()}`);
    console.log(`👑 Platform Authority: ${PLATFORM_AUTHORITY}`);
    console.log(`🤖 AI Oracle Authority: ${aiOracleKeypair.publicKey.toString()}`);
    console.log(`🪙 Carbon Token Mint: ${carbonTokenMint.toString()}`);
    console.log(`💰 Platform Fee Account: ${platformFeeAccount.address.toString()}`);
    console.log(`💸 Platform Fee: ${INVESTMENT_FEE_BPS / 100}%`);
    console.log(`🎯 Min AI Confidence: ${MIN_AI_CONFIDENCE}%`);
    console.log("=".repeat(80));

    // Step 8: Save deployment info to file
    const deploymentInfo = {
      network: NETWORK,
      programId: program.programId.toString(),
      platformState: platformStatePDA.toString(),
      platformAuthority: PLATFORM_AUTHORITY,
      aiOracleAuthority: aiOracleKeypair.publicKey.toString(),
      carbonTokenMint: carbonTokenMint.toString(),
      platformFeeAccount: platformFeeAccount.address.toString(),
      investmentFeeBps: INVESTMENT_FEE_BPS,
      minAiConfidence: MIN_AI_CONFIDENCE,
      demoProjects: demoProjects.map((p, i) => ({
        id: p.id,
        name: p.name,
        pda: PublicKey.findProgramAddressSync(
          [Buffer.from("project"), new anchor.BN(p.id).toArrayLike(Buffer, "le", 8)],
          program.programId
        )[0].toString(),
      })),
      deployedAt: new Date().toISOString(),
      deployerPublicKey: deployerKeypair.publicKey.toString(),
    };

    const deploymentFileName = `deployment-${NETWORK}-${Date.now()}.json`;
    fs.writeFileSync(deploymentFileName, JSON.stringify(deploymentInfo, null, 2));
    console.log(`💾 Deployment info saved to: ${deploymentFileName}`);

    // Step 9: Save AI Oracle keypair securely
    const aiOracleFileName = `ai-oracle-${NETWORK}-${Date.now()}.json`;
    fs.writeFileSync(
      aiOracleFileName, 
      JSON.stringify(Array.from(aiOracleKeypair.secretKey)),
      { mode: 0o600 } // Secure file permissions
    );
    console.log(`🔐 AI Oracle keypair saved to: ${aiOracleFileName}`);

    // Step 10: Generate environment variable updates
    console.log("\n📋 ENVIRONMENT VARIABLE UPDATES");
    console.log("=".repeat(80));
    console.log("Add these to your .env.local file:");
    console.log("");
    console.log(`NEXT_PUBLIC_PROGRAM_ID=${program.programId.toString()}`);
    console.log(`NEXT_PUBLIC_PLATFORM_STATE=${platformStatePDA.toString()}`);
    console.log(`NEXT_PUBLIC_CARBON_TOKEN_MINT=${carbonTokenMint.toString()}`);
    console.log(`NEXT_PUBLIC_AI_ORACLE_AUTHORITY=${aiOracleKeypair.publicKey.toString()}`);
    console.log("");

    // Step 11: Instructions for frontend integration
    console.log("🔗 FRONTEND INTEGRATION INSTRUCTIONS");
    console.log("=".repeat(80));
    console.log("1. Update .env.local with the variables above");
    console.log("2. Install dependencies: npm install");
    console.log("3. Start development server: npm run dev");
    console.log("4. The platform is ready for testing!");
    console.log("");
    console.log("🚀 FEATURES AVAILABLE:");
    console.log("   ✅ Project creation with AI verification");
    console.log("   ✅ Investment tracking with tier bonuses");
    console.log("   ✅ Carbon credit minting");
    console.log("   ✅ Real-time forest monitoring");
    console.log("   ✅ Emergency pause functionality");
    console.log("   ✅ Multi-tier investment system");
    console.log("=".repeat(80));

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    
    // Save error details for debugging
    const errorInfo = {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      network: NETWORK,
      deployerPublicKey: deployerKeypair.publicKey.toString(),
    };
    
    fs.writeFileSync(
      `deployment-error-${NETWORK}-${Date.now()}.json`,
      JSON.stringify(errorInfo, null, 2)
    );
    
    process.exit(1);
  }
}

// Helper function to validate environment
function validateEnvironment() {
  const requiredVars = ['SOLANA_NETWORK'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    console.warn("Using default values...");
  }
}

if (require.main === module) {
  validateEnvironment();
  main().catch(console.error);
}

export { main as deployGreenChain };