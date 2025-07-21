import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { 
  Connection, 
  Keypair, 
  PublicKey, 
  SystemProgram,
  LAMPORTS_PER_SOL 
} from "@solana/web3.js";
import { 
  createMint, 
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { GreenChainReforestation } from "../target/types/greenchain_reforestation";

// Configuration
const NETWORK = "devnet"; // Change to "mainnet-beta" for production
const PLATFORM_AUTHORITY = "63Gv5H8L2rZx1pHnTmJ58fWwiMyRUAN9zY3SFMkcwK3Z"; // Your Solflare wallet
const INVESTMENT_FEE_BPS = 250; // 2.5% platform fee

async function main() {
  console.log("🌱 Deploying GreenChain Reforestation Platform to Solana", NETWORK);
  
  // Setup connection and provider
  const connection = new Connection(
    NETWORK === "devnet" 
      ? "https://api.devnet.solana.com"
      : "https://api.mainnet-beta.solana.com",
    "confirmed"
  );

  // Load deployer wallet (you'll need to have this keypair file)
  const deployerKeypair = Keypair.generate(); // Replace with actual keypair loading
  console.log("Deployer public key:", deployerKeypair.publicKey.toString());

  // Airdrop SOL for devnet testing
  if (NETWORK === "devnet") {
    console.log("Requesting airdrop...");
    const airdropSignature = await connection.requestAirdrop(
      deployerKeypair.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);
    console.log("Airdrop confirmed");
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
      deployerKeypair.publicKey, // mint authority (will be transferred to platform)
      null, // freeze authority
      6, // decimals
      undefined,
      undefined,
      TOKEN_PROGRAM_ID
    );
    console.log("Carbon Token Mint:", carbonTokenMint.toString());

    // Step 2: Initialize Platform
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
        INVESTMENT_FEE_BPS
      )
      .accounts({
        platformState: platformStatePDA,
        authority: deployerKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([deployerKeypair])
      .rpc();

    console.log("Platform initialized. Transaction:", initTx);
    console.log("Platform State PDA:", platformStatePDA.toString());

    // Step 3: Create Platform Fee Token Account
    console.log("\n💰 Creating Platform Fee Account...");
    const platformFeeAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      deployerKeypair,
      new PublicKey("So11111111111111111111111111111111111111112"), // WSOL mint
      platformAuthorityPubkey
    );
    console.log("Platform Fee Account:", platformFeeAccount.address.toString());

    // Step 4: Transfer mint authority to platform (for carbon credits)
    console.log("\n🔐 Transferring mint authority to platform...");
    const transferAuthorityTx = await program.provider.connection.sendTransaction(
      new anchor.web3.Transaction().add(
        anchor.utils.token.createSetAuthorityInstruction(
          carbonTokenMint,
          deployerKeypair.publicKey,
          "MintTokens",
          platformStatePDA,
          []
        )
      ),
      [deployerKeypair]
    );
    await connection.confirmTransaction(transferAuthorityTx);
    console.log("Mint authority transferred. Transaction:", transferAuthorityTx);

    // Step 5: Create a demo project
    console.log("\n🌳 Creating Demo Project...");
    const projectId = 1;
    const [projectPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("project"), new anchor.BN(projectId).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const createProjectTx = await program.methods
      .createProject(
        new anchor.BN(projectId),
        "Amazon Rainforest Restoration",
        "Large-scale reforestation project in the Amazon rainforest focusing on native species restoration and biodiversity conservation. This project aims to plant 100,000 trees over 5 years with AI-powered monitoring and verification.",
        "Amazon Basin, Brazil",
        new anchor.BN(100000), // target trees
        new anchor.BN(1000000), // target funding in lamports
        new anchor.BN(25), // 25 kg CO2 per tree
        85 // 85% AI prediction score
      )
      .accounts({
        project: projectPDA,
        platformState: platformStatePDA,
        creator: deployerKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([deployerKeypair])
      .rpc();

    console.log("Demo project created. Transaction:", createProjectTx);
    console.log("Project PDA:", projectPDA.toString());

    // Step 6: Create user profile for platform authority
    console.log("\n👤 Creating User Profile...");
    const [userProfilePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), platformAuthorityPubkey.toBuffer()],
      program.programId
    );

    const createProfileTx = await program.methods
      .updateUserProfile(
        "GreenChainFounder",
        "Founder of GreenChain - Building the future of reforestation through AI and blockchain technology 🌱",
        "Global"
      )
      .accounts({
        userProfile: userProfilePDA,
        user: deployerKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([deployerKeypair])
      .rpc();

    console.log("User profile created. Transaction:", createProfileTx);
    console.log("User Profile PDA:", userProfilePDA.toString());

    // Step 7: Display deployment summary
    console.log("\n✅ Deployment Complete!");
    console.log("=".repeat(60));
    console.log("📋 DEPLOYMENT SUMMARY");
    console.log("=".repeat(60));
    console.log(`🌐 Network: ${NETWORK}`);
    console.log(`🏗️  Program ID: ${program.programId.toString()}`);
    console.log(`🏛️  Platform State: ${platformStatePDA.toString()}`);
    console.log(`👑 Platform Authority: ${PLATFORM_AUTHORITY}`);
    console.log(`🪙 Carbon Token Mint: ${carbonTokenMint.toString()}`);
    console.log(`💰 Platform Fee Account: ${platformFeeAccount.address.toString()}`);
    console.log(`🌳 Demo Project: ${projectPDA.toString()}`);
    console.log(`👤 User Profile: ${userProfilePDA.toString()}`);
    console.log(`💸 Platform Fee: ${INVESTMENT_FEE_BPS / 100}%`);
    console.log("=".repeat(60));

    // Step 8: Save deployment info to file
    const deploymentInfo = {
      network: NETWORK,
      programId: program.programId.toString(),
      platformState: platformStatePDA.toString(),
      platformAuthority: PLATFORM_AUTHORITY,
      carbonTokenMint: carbonTokenMint.toString(),
      platformFeeAccount: platformFeeAccount.address.toString(),
      demoProject: projectPDA.toString(),
      userProfile: userProfilePDA.toString(),
      investmentFeeBps: INVESTMENT_FEE_BPS,
      deployedAt: new Date().toISOString(),
    };

    console.log("\n💾 Saving deployment info...");
    const fs = require('fs');
    fs.writeFileSync(
      `deployment-${NETWORK}.json`,
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(`Deployment info saved to deployment-${NETWORK}.json`);

    // Step 9: Instructions for frontend integration
    console.log("\n🔗 FRONTEND INTEGRATION INSTRUCTIONS");
    console.log("=".repeat(60));
    console.log("1. Update your frontend environment variables:");
    console.log(`   NEXT_PUBLIC_SOLANA_NETWORK=${NETWORK}`);
    console.log(`   NEXT_PUBLIC_PROGRAM_ID=${program.programId.toString()}`);
    console.log(`   NEXT_PUBLIC_PLATFORM_STATE=${platformStatePDA.toString()}`);
    console.log(`   NEXT_PUBLIC_CARBON_TOKEN_MINT=${carbonTokenMint.toString()}`);
    console.log("");
    console.log("2. Connect your Solflare wallet with address:");
    console.log(`   ${PLATFORM_AUTHORITY}`);
    console.log("");
    console.log("3. The platform is ready for testing!");
    console.log("   - Create projects");
    console.log("   - Make investments");
    console.log("   - Track carbon credits");
    console.log("   - Update project progress");
    console.log("=".repeat(60));

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

// Helper function to create a test investment (optional)
async function createTestInvestment(
  program: Program<GreenChainReforestation>,
  connection: Connection,
  investor: Keypair,
  projectId: number,
  amount: number
) {
  console.log(`\n💰 Creating test investment of ${amount} lamports...`);
  
  const [projectPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("project"), new anchor.BN(projectId).toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const [platformStatePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("platform")],
    program.programId
  );

  const [investorProfilePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("profile"), investor.publicKey.toBuffer()],
    program.programId
  );

  const [investmentPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("investment"),
      investor.publicKey.toBuffer(),
      new anchor.BN(projectId).toArrayLike(Buffer, "le", 8)
    ],
    program.programId
  );

  // You would need to create token accounts and fund them here
  // This is a simplified example
  
  console.log("Test investment setup complete");
}

if (require.main === module) {
  main().catch(console.error);
}

export { main as deployGreenChain };