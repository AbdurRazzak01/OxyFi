use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer, MintTo, SetAuthority},
};
use spl_token::instruction::AuthorityType;

declare_id!("GreenChain11111111111111111111111111111111");

#[program]
pub mod greenchain_reforestation {
    use super::*;

    /// Initialize the GreenChain platform with enhanced AI and multi-tier features
    pub fn initialize_platform(
        ctx: Context<InitializePlatform>,
        platform_authority: Pubkey,
        carbon_token_mint: Pubkey,
        investment_fee_bps: u16,
        ai_oracle_authority: Pubkey,
        min_ai_confidence: u8,
        ai_update_interval: i64,
    ) -> Result<()> {
        require!(!ctx.accounts.platform_state.is_initialized, ErrorCode::AlreadyInitialized);
        
        let platform_state = &mut ctx.accounts.platform_state;
        platform_state.authority = platform_authority;
        platform_state.carbon_token_mint = carbon_token_mint;
        platform_state.investment_fee_bps = investment_fee_bps;
        platform_state.ai_oracle_authority = ai_oracle_authority;
        platform_state.min_ai_confidence = min_ai_confidence;
        platform_state.ai_update_interval = ai_update_interval;
        platform_state.total_projects = 0;
        platform_state.total_investments = 0;
        platform_state.total_carbon_credits = 0;
        platform_state.total_trees_planted = 0;
        platform_state.total_co2_offset = 0;
        platform_state.emergency_pause = false;
        platform_state.is_initialized = true;
        platform_state.last_ai_update = Clock::get()?.unix_timestamp;
        platform_state.platform_version = 2; // Enhanced version
        platform_state.bump = *ctx.bumps.get("platform_state").unwrap();
        
        emit!(PlatformInitialized {
            authority: platform_authority,
            carbon_token_mint,
            ai_oracle_authority,
            version: 2,
        });

        Ok(())
    }

    /// Create a new reforestation project with enhanced AI verification and multi-tier support
    pub fn create_project(
        ctx: Context<CreateProject>,
        project_id: u64,
        name: String,
        description: String,
        location: String,
        target_trees: u64,
        target_funding: u64,
        ai_health_score: u8,
        ai_confidence: u8,
        ai_risk_assessment: u8,
        satellite_verification_hash: String,
        expected_co2_per_tree: u32,
        project_tier: ProjectTier,
    ) -> Result<()> {
        require!(!ctx.accounts.platform_state.emergency_pause, ErrorCode::PlatformPaused);
        require!(name.len() <= 100, ErrorCode::NameTooLong);
        require!(description.len() <= 500, ErrorCode::DescriptionTooLong);
        require!(target_trees > 0, ErrorCode::InvalidTargetTrees);
        require!(target_funding > 0, ErrorCode::InvalidTargetFunding);
        require!(ai_confidence >= ctx.accounts.platform_state.min_ai_confidence, ErrorCode::InsufficientAIConfidence);
        require!(ai_health_score >= 60, ErrorCode::InsufficientHealthScore);
        require!(ai_risk_assessment <= 40, ErrorCode::ExcessiveRisk);
        require!(satellite_verification_hash.len() == 64, ErrorCode::InvalidSatelliteHash);

        let project = &mut ctx.accounts.project;
        project.id = project_id;
        project.name = name;
        project.description = description;
        project.location = location;
        project.creator = ctx.accounts.creator.key();
        project.target_trees = target_trees;
        project.target_funding = target_funding;
        project.current_funding = 0;
        project.trees_planted = 0;
        project.status = ProjectStatus::Active;
        project.created_at = Clock::get()?.unix_timestamp;
        project.ai_health_score = ai_health_score;
        project.ai_confidence = ai_confidence;
        project.ai_risk_assessment = ai_risk_assessment;
        project.satellite_verification_hash = satellite_verification_hash;
        project.expected_co2_per_tree = expected_co2_per_tree;
        project.project_tier = project_tier;
        project.last_ai_update = Clock::get()?.unix_timestamp;
        project.carbon_credits_minted = 0;
        project.total_investors = 0;
        project.bump = *ctx.bumps.get("project").unwrap();

        // Update platform state
        let platform_state = &mut ctx.accounts.platform_state;
        platform_state.total_projects += 1;

        emit!(ProjectCreated {
            project_id,
            creator: ctx.accounts.creator.key(),
            target_trees,
            target_funding,
            ai_health_score,
            ai_confidence,
            project_tier,
            satellite_hash: satellite_verification_hash,
        });

        Ok(())
    }

    /// Enhanced investment function with multi-tier system and AI-based bonuses
    pub fn invest_in_project(
        ctx: Context<InvestInProject>,
        amount: u64,
        investment_tier: InvestmentTier,
    ) -> Result<()> {
        require!(!ctx.accounts.platform_state.emergency_pause, ErrorCode::PlatformPaused);
        require!(amount > 0, ErrorCode::InvalidInvestmentAmount);
        require!(ctx.accounts.project.status == ProjectStatus::Active, ErrorCode::ProjectNotActive);
        
        let project = &mut ctx.accounts.project;
        require!(project.current_funding + amount <= project.target_funding, ErrorCode::ExceedsTargetFunding);

        // Calculate tier-based bonuses
        let (min_amount, bonus_multiplier) = match investment_tier {
            InvestmentTier::Bronze => (1_000_000, 100), // 1 SOL, 1x
            InvestmentTier::Silver => (5_000_000, 110), // 5 SOL, 1.1x
            InvestmentTier::Gold => (10_000_000, 125), // 10 SOL, 1.25x
            InvestmentTier::Platinum => (50_000_000, 150), // 50 SOL, 1.5x
            InvestmentTier::Diamond => (100_000_000, 200), // 100 SOL, 2x
        };

        require!(amount >= min_amount, ErrorCode::InsufficientTierAmount);

        // AI-based bonus calculation
        let ai_bonus = if project.ai_health_score >= 90 && project.ai_confidence >= 95 {
            20 // 20% additional bonus for high-confidence, high-health projects
        } else if project.ai_health_score >= 80 && project.ai_confidence >= 85 {
            10 // 10% bonus for good projects
        } else {
            0
        };

        let total_multiplier = bonus_multiplier + ai_bonus;

        // Transfer investment amount
        let cpi_accounts = Transfer {
            from: ctx.accounts.investor_token_account.to_account_info(),
            to: ctx.accounts.project_treasury.to_account_info(),
            authority: ctx.accounts.investor.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Calculate and transfer platform fee
        let platform_fee = (amount * ctx.accounts.platform_state.investment_fee_bps as u64) / 10000;
        if platform_fee > 0 {
            let fee_accounts = Transfer {
                from: ctx.accounts.investor_token_account.to_account_info(),
                to: ctx.accounts.platform_treasury.to_account_info(),
                authority: ctx.accounts.investor.to_account_info(),
            };
            let fee_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), fee_accounts);
            token::transfer(fee_ctx, platform_fee)?;
        }

        // Create or update investment record
        let investment = &mut ctx.accounts.investment;
        investment.project_id = project.id;
        investment.investor = ctx.accounts.investor.key();
        investment.amount = amount;
        investment.investment_tier = investment_tier;
        investment.bonus_multiplier = total_multiplier;
        investment.timestamp = Clock::get()?.unix_timestamp;
        investment.is_active = true;
        investment.carbon_credits_earned = 0;
        investment.bump = *ctx.bumps.get("investment").unwrap();

        // Update project and platform state
        project.current_funding += amount;
        project.total_investors += 1;
        
        let platform_state = &mut ctx.accounts.platform_state;
        platform_state.total_investments += amount;

        // Check if project is fully funded
        if project.current_funding >= project.target_funding {
            project.status = ProjectStatus::Funded;
        }

        emit!(InvestmentMade {
            project_id: project.id,
            investor: ctx.accounts.investor.key(),
            amount,
            investment_tier,
            bonus_multiplier: total_multiplier,
            ai_bonus,
        });

        Ok(())
    }

    /// Update project with AI-verified progress and satellite data
    pub fn update_project_progress(
        ctx: Context<UpdateProjectProgress>,
        trees_planted: u64,
        ai_health_score: u8,
        ai_confidence: u8,
        satellite_verification_hash: String,
        co2_sequestered: u64,
    ) -> Result<()> {
        require!(!ctx.accounts.platform_state.emergency_pause, ErrorCode::PlatformPaused);
        require!(ctx.accounts.ai_oracle.key() == ctx.accounts.platform_state.ai_oracle_authority, ErrorCode::UnauthorizedAIOracle);
        require!(ai_confidence >= ctx.accounts.platform_state.min_ai_confidence, ErrorCode::InsufficientAIConfidence);
        require!(satellite_verification_hash.len() == 64, ErrorCode::InvalidSatelliteHash);

        let project = &mut ctx.accounts.project;
        require!(trees_planted <= project.target_trees, ErrorCode::ExceedsTargetTrees);
        require!(project.status == ProjectStatus::Active || project.status == ProjectStatus::Funded, ErrorCode::ProjectNotActive);

        // Verify AI update interval
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time - project.last_ai_update >= ctx.accounts.platform_state.ai_update_interval,
            ErrorCode::TooFrequentAIUpdate
        );

        // Update project with AI-verified data
        project.trees_planted = trees_planted;
        project.ai_health_score = ai_health_score;
        project.ai_confidence = ai_confidence;
        project.satellite_verification_hash = satellite_verification_hash.clone();
        project.last_ai_update = current_time;

        // Update platform state
        let platform_state = &mut ctx.accounts.platform_state;
        platform_state.total_trees_planted = platform_state.total_trees_planted
            .checked_add(trees_planted.saturating_sub(project.trees_planted))
            .ok_or(ErrorCode::MathOverflow)?;
        platform_state.total_co2_offset = platform_state.total_co2_offset
            .checked_add(co2_sequestered)
            .ok_or(ErrorCode::MathOverflow)?;

        // Check if project is completed
        if trees_planted >= project.target_trees {
            project.status = ProjectStatus::Completed;
        }

        emit!(ProjectProgressUpdated {
            project_id: project.id,
            trees_planted,
            ai_health_score,
            ai_confidence,
            satellite_hash: satellite_verification_hash,
            co2_sequestered,
        });

        Ok(())
    }

    /// Claim carbon credits with enhanced calculation based on AI health scores and investment tiers
    pub fn claim_carbon_credits(ctx: Context<ClaimCarbonCredits>) -> Result<()> {
        require!(!ctx.accounts.platform_state.emergency_pause, ErrorCode::PlatformPaused);
        require!(ctx.accounts.project.status == ProjectStatus::Completed, ErrorCode::ProjectNotCompleted);
        require!(ctx.accounts.investment.is_active, ErrorCode::InvestmentNotActive);
        require!(ctx.accounts.investment.project_id == ctx.accounts.project.id, ErrorCode::ProjectMismatch);

        let project = &ctx.accounts.project;
        let investment = &mut ctx.accounts.investment;

        // Enhanced carbon credit calculation
        let base_credits = (investment.amount * project.expected_co2_per_tree as u64) / 1_000_000; // Base calculation
        
        // AI health score multiplier (80-100% -> 0.8-1.2x)
        let health_multiplier = (project.ai_health_score as u64 * 4 + 480) / 1000; // Maps 80-100 to 800-880, then /1000 for 0.8-0.88
        
        // Investment tier bonus
        let tier_multiplier = investment.bonus_multiplier as u64;
        
        // Final calculation with all bonuses
        let total_credits = (base_credits * health_multiplier * tier_multiplier) / 10000;

        // Mint carbon credits to investor
        let mint_accounts = MintTo {
            mint: ctx.accounts.carbon_token_mint.to_account_info(),
            to: ctx.accounts.investor_carbon_account.to_account_info(),
            authority: ctx.accounts.platform_state.to_account_info(),
        };

        let platform_seeds = &[
            b"platform_state",
            &[ctx.accounts.platform_state.bump],
        ];
        let signer_seeds = &[&platform_seeds[..]];

        let mint_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            mint_accounts,
            signer_seeds,
        );
        token::mint_to(mint_ctx, total_credits)?;

        // Update records
        investment.carbon_credits_earned = total_credits;
        investment.is_active = false; // Mark as claimed

        let platform_state = &mut ctx.accounts.platform_state;
        platform_state.total_carbon_credits = platform_state.total_carbon_credits
            .checked_add(total_credits)
            .ok_or(ErrorCode::MathOverflow)?;

        emit!(CarbonCreditsClaimed {
            user: ctx.accounts.investor.key(),
            project_id: project.id,
            amount: total_credits,
            total_offset: platform_state.total_carbon_credits,
            investment_tier: investment.investment_tier,
            ai_health_bonus: health_multiplier,
        });

        Ok(())
    }

    /// Emergency pause function for security
    pub fn emergency_pause(ctx: Context<EmergencyAction>) -> Result<()> {
        require!(ctx.accounts.authority.key() == ctx.accounts.platform_state.authority, ErrorCode::UnauthorizedEmergency);
        
        let platform_state = &mut ctx.accounts.platform_state;
        platform_state.emergency_pause = true;

        emit!(EmergencyPause {
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Emergency resume function
    pub fn emergency_resume(ctx: Context<EmergencyAction>) -> Result<()> {
        require!(ctx.accounts.authority.key() == ctx.accounts.platform_state.authority, ErrorCode::UnauthorizedEmergency);
        
        let platform_state = &mut ctx.accounts.platform_state;
        platform_state.emergency_pause = false;

        emit!(EmergencyResume {
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Update AI oracle authority
    pub fn update_ai_oracle(
        ctx: Context<UpdateAIOracle>,
        new_ai_oracle: Pubkey,
    ) -> Result<()> {
        require!(ctx.accounts.authority.key() == ctx.accounts.platform_state.authority, ErrorCode::UnauthorizedEmergency);
        
        let platform_state = &mut ctx.accounts.platform_state;
        platform_state.ai_oracle_authority = new_ai_oracle;

        emit!(AIOracleUpdated {
            old_oracle: ctx.accounts.platform_state.ai_oracle_authority,
            new_oracle: new_ai_oracle,
        });

        Ok(())
    }

    /// Anomaly detection and automated response
    pub fn report_anomaly(
        ctx: Context<ReportAnomaly>,
        project_id: u64,
        anomaly_type: AnomalyType,
        severity: u8,
        ai_confidence: u8,
        satellite_evidence_hash: String,
    ) -> Result<()> {
        require!(ctx.accounts.ai_oracle.key() == ctx.accounts.platform_state.ai_oracle_authority, ErrorCode::UnauthorizedAIOracle);
        require!(ai_confidence >= 90, ErrorCode::InsufficientAIConfidence); // High confidence required for anomalies
        require!(severity <= 100, ErrorCode::InvalidSeverity);
        require!(satellite_evidence_hash.len() == 64, ErrorCode::InvalidSatelliteHash);

        let project = &mut ctx.accounts.project;
        require!(project.id == project_id, ErrorCode::ProjectMismatch);

        // Automated response based on severity
        if severity >= 80 {
            project.status = ProjectStatus::Suspended; // Auto-suspend high-severity anomalies
        } else if severity >= 50 {
            project.ai_health_score = project.ai_health_score.saturating_sub(severity / 2); // Reduce health score
        }

        emit!(AnomalyDetected {
            project_id,
            anomaly_type,
            severity,
            ai_confidence,
            automated_action: if severity >= 80 { "suspended".to_string() } else { "health_reduced".to_string() },
            satellite_evidence: satellite_evidence_hash,
        });

        Ok(())
    }
}

// Account structures
#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + std::mem::size_of::<PlatformState>(),
        seeds = [b"platform_state"],
        bump
    )]
    pub platform_state: Account<'info, PlatformState>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(project_id: u64)]
pub struct CreateProject<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + std::mem::size_of::<Project>(),
        seeds = [b"project", project_id.to_le_bytes().as_ref()],
        bump
    )]
    pub project: Account<'info, Project>,
    #[account(mut)]
    pub platform_state: Account<'info, PlatformState>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InvestInProject<'info> {
    #[account(mut)]
    pub project: Account<'info, Project>,
    #[account(mut)]
    pub platform_state: Account<'info, PlatformState>,
    #[account(
        init_if_needed,
        payer = investor,
        space = 8 + std::mem::size_of::<Investment>(),
        seeds = [b"investment", project.key().as_ref(), investor.key().as_ref()],
        bump
    )]
    pub investment: Account<'info, Investment>,
    #[account(mut)]
    pub investor: Signer<'info>,
    #[account(mut)]
    pub investor_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub project_treasury: Account<'info, TokenAccount>,
    #[account(mut)]
    pub platform_treasury: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateProjectProgress<'info> {
    #[account(mut)]
    pub project: Account<'info, Project>,
    #[account(mut)]
    pub platform_state: Account<'info, PlatformState>,
    pub ai_oracle: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimCarbonCredits<'info> {
    pub project: Account<'info, Project>,
    #[account(mut)]
    pub platform_state: Account<'info, PlatformState>,
    #[account(mut)]
    pub investment: Account<'info, Investment>,
    pub investor: Signer<'info>,
    #[account(mut)]
    pub carbon_token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub investor_carbon_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct EmergencyAction<'info> {
    #[account(mut)]
    pub platform_state: Account<'info, PlatformState>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateAIOracle<'info> {
    #[account(mut)]
    pub platform_state: Account<'info, PlatformState>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ReportAnomaly<'info> {
    #[account(mut)]
    pub project: Account<'info, Project>,
    pub platform_state: Account<'info, PlatformState>,
    pub ai_oracle: Signer<'info>,
}

// Data structures
#[account]
pub struct PlatformState {
    pub authority: Pubkey,
    pub carbon_token_mint: Pubkey,
    pub ai_oracle_authority: Pubkey,
    pub investment_fee_bps: u16,
    pub min_ai_confidence: u8,
    pub ai_update_interval: i64,
    pub total_projects: u64,
    pub total_investments: u64,
    pub total_carbon_credits: u64,
    pub total_trees_planted: u64,
    pub total_co2_offset: u64,
    pub emergency_pause: bool,
    pub is_initialized: bool,
    pub last_ai_update: i64,
    pub platform_version: u8,
    pub bump: u8,
}

#[account]
pub struct Project {
    pub id: u64,
    pub name: String,
    pub description: String,
    pub location: String,
    pub creator: Pubkey,
    pub target_trees: u64,
    pub target_funding: u64,
    pub current_funding: u64,
    pub trees_planted: u64,
    pub status: ProjectStatus,
    pub created_at: i64,
    pub ai_health_score: u8,
    pub ai_confidence: u8,
    pub ai_risk_assessment: u8,
    pub satellite_verification_hash: String,
    pub expected_co2_per_tree: u32,
    pub project_tier: ProjectTier,
    pub last_ai_update: i64,
    pub carbon_credits_minted: u64,
    pub total_investors: u32,
    pub bump: u8,
}

#[account]
pub struct Investment {
    pub project_id: u64,
    pub investor: Pubkey,
    pub amount: u64,
    pub investment_tier: InvestmentTier,
    pub bonus_multiplier: u16,
    pub timestamp: i64,
    pub is_active: bool,
    pub carbon_credits_earned: u64,
    pub bump: u8,
}

// Enums
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProjectStatus {
    Active,
    Funded,
    Completed,
    Suspended,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProjectTier {
    Community,    // Small local projects
    Regional,     // Medium regional projects
    Enterprise,   // Large commercial projects
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum InvestmentTier {
    Bronze,       // 1+ SOL
    Silver,       // 5+ SOL
    Gold,         // 10+ SOL
    Platinum,     // 50+ SOL
    Diamond,      // 100+ SOL
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum AnomalyType {
    Deforestation,
    IllegalLogging,
    Fire,
    Disease,
    UnauthorizedAccess,
    EnvironmentalDamage,
}

// Events
#[event]
pub struct PlatformInitialized {
    pub authority: Pubkey,
    pub carbon_token_mint: Pubkey,
    pub ai_oracle_authority: Pubkey,
    pub version: u8,
}

#[event]
pub struct ProjectCreated {
    pub project_id: u64,
    pub creator: Pubkey,
    pub target_trees: u64,
    pub target_funding: u64,
    pub ai_health_score: u8,
    pub ai_confidence: u8,
    pub project_tier: ProjectTier,
    pub satellite_hash: String,
}

#[event]
pub struct InvestmentMade {
    pub project_id: u64,
    pub investor: Pubkey,
    pub amount: u64,
    pub investment_tier: InvestmentTier,
    pub bonus_multiplier: u16,
    pub ai_bonus: u16,
}

#[event]
pub struct ProjectProgressUpdated {
    pub project_id: u64,
    pub trees_planted: u64,
    pub ai_health_score: u8,
    pub ai_confidence: u8,
    pub satellite_hash: String,
    pub co2_sequestered: u64,
}

#[event]
pub struct CarbonCreditsClaimed {
    pub user: Pubkey,
    pub project_id: u64,
    pub amount: u64,
    pub total_offset: u64,
    pub investment_tier: InvestmentTier,
    pub ai_health_bonus: u64,
}

#[event]
pub struct EmergencyPause {
    pub timestamp: i64,
}

#[event]
pub struct EmergencyResume {
    pub timestamp: i64,
}

#[event]
pub struct AIOracleUpdated {
    pub old_oracle: Pubkey,
    pub new_oracle: Pubkey,
}

#[event]
pub struct AnomalyDetected {
    pub project_id: u64,
    pub anomaly_type: AnomalyType,
    pub severity: u8,
    pub ai_confidence: u8,
    pub automated_action: String,
    pub satellite_evidence: String,
}

// Error codes
#[error_code]
pub enum ErrorCode {
    #[msg("Platform already initialized")]
    AlreadyInitialized,
    #[msg("Name is too long")]
    NameTooLong,
    #[msg("Description is too long")]
    DescriptionTooLong,
    #[msg("Invalid target trees")]
    InvalidTargetTrees,
    #[msg("Invalid target funding")]
    InvalidTargetFunding,
    #[msg("Insufficient AI confidence score")]
    InsufficientAIConfidence,
    #[msg("Insufficient health score")]
    InsufficientHealthScore,
    #[msg("Excessive risk assessment")]
    ExcessiveRisk,
    #[msg("Invalid satellite verification hash")]
    InvalidSatelliteHash,
    #[msg("Invalid investment amount")]
    InvalidInvestmentAmount,
    #[msg("Insufficient amount for tier")]
    InsufficientTierAmount,
    #[msg("Project is not active")]
    ProjectNotActive,
    #[msg("Investment exceeds target funding")]
    ExceedsTargetFunding,
    #[msg("Unauthorized to update project")]
    UnauthorizedUpdate,
    #[msg("Trees planted exceeds target")]
    ExceedsTargetTrees,
    #[msg("Not an investor in this project")]
    NotInvestor,
    #[msg("Project ID mismatch")]
    ProjectMismatch,
    #[msg("Project is not completed")]
    ProjectNotCompleted,
    #[msg("Investment is not active")]
    InvestmentNotActive,
    #[msg("Unauthorized AI oracle")]
    UnauthorizedAIOracle,
    #[msg("Platform is paused")]
    PlatformPaused,
    #[msg("Unauthorized emergency action")]
    UnauthorizedEmergency,
    #[msg("AI update too frequent")]
    TooFrequentAIUpdate,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Invalid severity level")]
    InvalidSeverity,
}