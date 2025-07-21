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

    /// Initialize the GreenChain platform with enhanced features
    pub fn initialize_platform(
        ctx: Context<InitializePlatform>,
        platform_authority: Pubkey,
        carbon_token_mint: Pubkey,
        investment_fee_bps: u16,
        ai_oracle_authority: Pubkey,
        min_ai_confidence: u8,
    ) -> Result<()> {
        let platform_state = &mut ctx.accounts.platform_state;
        platform_state.authority = platform_authority;
        platform_state.carbon_token_mint = carbon_token_mint;
        platform_state.investment_fee_bps = investment_fee_bps;
        platform_state.ai_oracle_authority = ai_oracle_authority;
        platform_state.min_ai_confidence = min_ai_confidence;
        platform_state.total_projects = 0;
        platform_state.total_investments = 0;
        platform_state.total_carbon_credits = 0;
        platform_state.total_trees_planted = 0;
        platform_state.total_co2_offset = 0;
        platform_state.emergency_pause = false;
        platform_state.bump = *ctx.bumps.get("platform_state").unwrap();
        
        emit!(PlatformInitialized {
            authority: platform_authority,
            carbon_token_mint,
            ai_oracle_authority,
        });

        Ok(())
    }

    /// Create a new reforestation project with enhanced AI verification
    pub fn create_project(
        ctx: Context<CreateProject>,
        project_id: u64,
        name: String,
        description: String,
        location: ProjectLocation,
        target_trees: u64,
        target_funding: u64,
        carbon_credit_rate: u64,
        ai_prediction_data: AIPredictionData,
        verification_requirements: VerificationRequirements,
    ) -> Result<()> {
        require!(!ctx.accounts.platform_state.emergency_pause, ErrorCode::PlatformPaused);
        require!(name.len() <= 100, ErrorCode::NameTooLong);
        require!(description.len() <= 500, ErrorCode::DescriptionTooLong);
        require!(target_trees > 0, ErrorCode::InvalidTargetTrees);
        require!(target_funding > 0, ErrorCode::InvalidTargetFunding);
        require!(ai_prediction_data.confidence_score >= ctx.accounts.platform_state.min_ai_confidence, ErrorCode::InsufficientAIConfidence);

        let project = &mut ctx.accounts.project;
        let platform_state = &mut ctx.accounts.platform_state;

        project.id = project_id;
        project.creator = ctx.accounts.creator.key();
        project.name = name;
        project.description = description;
        project.location = location;
        project.target_trees = target_trees;
        project.target_funding = target_funding;
        project.current_funding = 0;
        project.trees_planted = 0;
        project.carbon_credits_issued = 0;
        project.carbon_credit_rate = carbon_credit_rate;
        project.ai_prediction_data = ai_prediction_data;
        project.verification_requirements = verification_requirements;
        project.status = ProjectStatus::Active;
        project.created_at = Clock::get()?.unix_timestamp;
        project.last_verification = 0;
        project.total_co2_offset = 0;
        project.bump = *ctx.bumps.get("project").unwrap();

        platform_state.total_projects += 1;

        emit!(ProjectCreated {
            project_id,
            creator: ctx.accounts.creator.key(),
            name: project.name.clone(),
            target_funding,
            target_trees,
            ai_confidence: ai_prediction_data.confidence_score,
            location: project.location.clone(),
        });

        Ok(())
    }

    /// Invest in a reforestation project with enhanced tracking
    pub fn invest_in_project(
        ctx: Context<InvestInProject>,
        amount: u64,
        investment_type: InvestmentType,
    ) -> Result<()> {
        require!(!ctx.accounts.platform_state.emergency_pause, ErrorCode::PlatformPaused);
        require!(amount > 0, ErrorCode::InvalidInvestmentAmount);

        let project = &mut ctx.accounts.project;
        let platform_state = &mut ctx.accounts.platform_state;
        let investor_profile = &mut ctx.accounts.investor_profile;

        require!(project.status == ProjectStatus::Active, ErrorCode::ProjectNotActive);
        require!(
            project.current_funding + amount <= project.target_funding,
            ErrorCode::ExceedsTargetFunding
        );

        // Calculate platform fee and carbon credit bonus
        let fee_amount = (amount as u128 * platform_state.investment_fee_bps as u128) / 10000;
        let investment_amount = amount - fee_amount as u64;
        
        // Calculate carbon credit allocation based on investment type
        let carbon_credit_multiplier = match investment_type {
            InvestmentType::Standard => 100,
            InvestmentType::Premium => 120,
            InvestmentType::VIP => 150,
        };

        // Transfer investment amount to project
        let cpi_accounts = Transfer {
            from: ctx.accounts.investor_token_account.to_account_info(),
            to: ctx.accounts.project_token_account.to_account_info(),
            authority: ctx.accounts.investor.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, investment_amount)?;

        // Transfer fee to platform
        if fee_amount > 0 {
            let cpi_accounts = Transfer {
                from: ctx.accounts.investor_token_account.to_account_info(),
                to: ctx.accounts.platform_fee_account.to_account_info(),
                authority: ctx.accounts.investor.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
            token::transfer(cpi_ctx, fee_amount as u64)?;
        }

        // Update project state
        project.current_funding += investment_amount;
        if project.current_funding >= project.target_funding {
            project.status = ProjectStatus::Funded;
        }

        // Update investor profile
        investor_profile.total_invested += investment_amount;
        investor_profile.projects_supported += 1;
        investor_profile.investment_tier = calculate_investment_tier(investor_profile.total_invested);

        // Update platform state
        platform_state.total_investments += investment_amount;

        // Create investment record
        let investment = &mut ctx.accounts.investment;
        investment.investor = ctx.accounts.investor.key();
        investment.project_id = project.id;
        investment.amount = investment_amount;
        investment.investment_type = investment_type;
        investment.carbon_credit_multiplier = carbon_credit_multiplier;
        investment.timestamp = Clock::get()?.unix_timestamp;
        investment.status = InvestmentStatus::Active;
        investment.bump = *ctx.bumps.get("investment").unwrap();

        emit!(InvestmentMade {
            investor: ctx.accounts.investor.key(),
            project_id: project.id,
            amount: investment_amount,
            investment_type,
            total_project_funding: project.current_funding,
            carbon_credit_multiplier,
        });

        Ok(())
    }

    /// Update project progress with AI verification
    pub fn update_project_progress(
        ctx: Context<UpdateProjectProgress>,
        trees_planted: u64,
        ai_verification_data: AIVerificationData,
        satellite_data_hash: String,
    ) -> Result<()> {
        require!(!ctx.accounts.platform_state.emergency_pause, ErrorCode::PlatformPaused);
        
        let project = &mut ctx.accounts.project;
        let platform_state = &mut ctx.accounts.platform_state;

        require!(
            ctx.accounts.authority.key() == project.creator || 
            ctx.accounts.authority.key() == platform_state.authority ||
            ctx.accounts.authority.key() == platform_state.ai_oracle_authority,
            ErrorCode::UnauthorizedUpdate
        );

        require!(
            ai_verification_data.confidence_score >= platform_state.min_ai_confidence,
            ErrorCode::InsufficientAIConfidence
        );

        require!(
            project.trees_planted + trees_planted <= project.target_trees,
            ErrorCode::ExceedsTargetTrees
        );

        // Update project progress
        project.trees_planted += trees_planted;
        project.last_verification = Clock::get()?.unix_timestamp;
        
        // Calculate CO2 offset based on tree type and age
        let co2_offset = calculate_co2_offset(
            trees_planted,
            project.carbon_credit_rate,
            &ai_verification_data
        );
        
        project.total_co2_offset += co2_offset;
        platform_state.total_trees_planted += trees_planted;
        platform_state.total_co2_offset += co2_offset;

        // Calculate carbon credits to issue
        let carbon_credits = (co2_offset * ai_verification_data.health_multiplier as u64) / 100;
        project.carbon_credits_issued += carbon_credits;
        platform_state.total_carbon_credits += carbon_credits;

        if project.trees_planted >= project.target_trees {
            project.status = ProjectStatus::Completed;
        }

        emit!(ProjectProgressUpdated {
            project_id: project.id,
            trees_planted,
            total_trees: project.trees_planted,
            carbon_credits_issued: carbon_credits,
            co2_offset,
            ai_confidence: ai_verification_data.confidence_score,
            health_score: ai_verification_data.health_score,
            satellite_data_hash,
        });

        Ok(())
    }

    /// Advanced AI-powered forest health analysis
    pub fn submit_ai_analysis(
        ctx: Context<SubmitAIAnalysis>,
        project_id: u64,
        analysis_data: ForestAnalysisData,
        prediction_data: AIPredictionData,
    ) -> Result<()> {
        require!(!ctx.accounts.platform_state.emergency_pause, ErrorCode::PlatformPaused);
        require!(
            ctx.accounts.ai_oracle.key() == ctx.accounts.platform_state.ai_oracle_authority,
            ErrorCode::UnauthorizedAIOracle
        );

        let project = &mut ctx.accounts.project;
        
        // Update project with new AI analysis
        project.ai_prediction_data = prediction_data;
        
        // Store analysis in dedicated account
        let analysis = &mut ctx.accounts.ai_analysis;
        analysis.project_id = project_id;
        analysis.timestamp = Clock::get()?.unix_timestamp;
        analysis.analysis_data = analysis_data;
        analysis.prediction_data = prediction_data.clone();
        analysis.bump = *ctx.bumps.get("ai_analysis").unwrap();

        emit!(AIAnalysisSubmitted {
            project_id,
            health_score: analysis_data.health_score,
            biodiversity_index: analysis_data.biodiversity_index,
            deforestation_risk: analysis_data.deforestation_risk,
            confidence_score: prediction_data.confidence_score,
            co2_sequestration_rate: prediction_data.co2_sequestration_rate,
        });

        Ok(())
    }

    /// Claim carbon credits from investments with enhanced calculations
    pub fn claim_carbon_credits(
        ctx: Context<ClaimCarbonCredits>,
        project_id: u64,
    ) -> Result<()> {
        require!(!ctx.accounts.platform_state.emergency_pause, ErrorCode::PlatformPaused);
        
        let investment = &ctx.accounts.investment;
        let project = &ctx.accounts.project;
        let user_profile = &mut ctx.accounts.user_profile;

        require!(investment.investor == ctx.accounts.user.key(), ErrorCode::NotInvestor);
        require!(investment.project_id == project_id, ErrorCode::ProjectMismatch);
        require!(project.status == ProjectStatus::Completed, ErrorCode::ProjectNotCompleted);
        require!(investment.status == InvestmentStatus::Active, ErrorCode::InvestmentNotActive);

        // Calculate carbon credits proportional to investment with multipliers
        let investment_percentage = (investment.amount as u128 * 10000) / project.current_funding as u128;
        let base_carbon_credits = (project.carbon_credits_issued as u128 * investment_percentage) / 10000;
        let final_carbon_credits = (base_carbon_credits * investment.carbon_credit_multiplier as u128) / 100;

        // Mint carbon credit tokens to user
        let seeds = &[
            b"platform".as_ref(),
            &[ctx.accounts.platform_state.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = MintTo {
            mint: ctx.accounts.carbon_token_mint.to_account_info(),
            to: ctx.accounts.user_carbon_token_account.to_account_info(),
            authority: ctx.accounts.platform_state.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::mint_to(cpi_ctx, final_carbon_credits as u64)?;

        // Update user profile
        user_profile.carbon_offset += final_carbon_credits as u64;
        user_profile.level = calculate_user_level(user_profile.total_invested, user_profile.carbon_offset);
        user_profile.last_claim = Clock::get()?.unix_timestamp;

        // Mark investment as claimed
        let investment_mut = &mut ctx.accounts.investment;
        investment_mut.status = InvestmentStatus::Claimed;

        emit!(CarbonCreditsClaimed {
            user: ctx.accounts.user.key(),
            project_id,
            amount: final_carbon_credits as u64,
            total_offset: user_profile.carbon_offset,
            investment_tier: investment.investment_type.clone(),
        });

        Ok(())
    }

    /// Emergency pause functionality
    pub fn emergency_pause(ctx: Context<EmergencyAction>) -> Result<()> {
        require!(
            ctx.accounts.authority.key() == ctx.accounts.platform_state.authority,
            ErrorCode::UnauthorizedEmergency
        );
        
        ctx.accounts.platform_state.emergency_pause = true;
        
        emit!(EmergencyPause {
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    /// Resume operations after emergency
    pub fn emergency_resume(ctx: Context<EmergencyAction>) -> Result<()> {
        require!(
            ctx.accounts.authority.key() == ctx.accounts.platform_state.authority,
            ErrorCode::UnauthorizedEmergency
        );
        
        ctx.accounts.platform_state.emergency_pause = false;
        
        emit!(EmergencyResume {
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }
}

// Helper functions
fn calculate_co2_offset(
    trees_planted: u64,
    base_rate: u64,
    ai_data: &AIVerificationData,
) -> u64 {
    let base_offset = trees_planted * base_rate;
    let health_adjustment = (base_offset * ai_data.health_score as u64) / 100;
    let age_adjustment = (health_adjustment * ai_data.tree_age_factor as u64) / 100;
    age_adjustment
}

fn calculate_investment_tier(total_invested: u64) -> InvestmentTier {
    match total_invested {
        0..=1000 => InvestmentTier::Bronze,
        1001..=5000 => InvestmentTier::Silver,
        5001..=25000 => InvestmentTier::Gold,
        25001..=100000 => InvestmentTier::Platinum,
        _ => InvestmentTier::Diamond,
    }
}

fn calculate_user_level(total_invested: u64, carbon_offset: u64) -> u8 {
    let score = (total_invested / 1000) + (carbon_offset / 100);
    match score {
        0..=99 => 1,
        100..=499 => 2,
        500..=999 => 3,
        1000..=2499 => 4,
        2500..=4999 => 5,
        5000..=9999 => 6,
        10000..=19999 => 7,
        20000..=49999 => 8,
        50000..=99999 => 9,
        _ => 10,
    }
}

// Account structures
#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + PlatformState::INIT_SPACE,
        seeds = [b"platform"],
        bump
    )]
    pub platform_state: Account<'info, PlatformState>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(project_id: u64)]
pub struct CreateProject<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + Project::INIT_SPACE,
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
        space = 8 + UserProfile::INIT_SPACE,
        seeds = [b"profile", investor.key().as_ref()],
        bump
    )]
    pub investor_profile: Account<'info, UserProfile>,
    
    #[account(
        init,
        payer = investor,
        space = 8 + Investment::INIT_SPACE,
        seeds = [b"investment", investor.key().as_ref(), project.id.to_le_bytes().as_ref()],
        bump
    )]
    pub investment: Account<'info, Investment>,
    
    #[account(mut)]
    pub investor: Signer<'info>,
    
    #[account(mut)]
    pub investor_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub project_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub platform_fee_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateProjectProgress<'info> {
    #[account(mut)]
    pub project: Account<'info, Project>,
    
    #[account(mut)]
    pub platform_state: Account<'info, PlatformState>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(project_id: u64)]
pub struct SubmitAIAnalysis<'info> {
    #[account(mut)]
    pub project: Account<'info, Project>,
    
    pub platform_state: Account<'info, PlatformState>,
    
    #[account(
        init,
        payer = ai_oracle,
        space = 8 + AIAnalysis::INIT_SPACE,
        seeds = [b"ai_analysis", project_id.to_le_bytes().as_ref(), Clock::get().unwrap().unix_timestamp.to_le_bytes().as_ref()],
        bump
    )]
    pub ai_analysis: Account<'info, AIAnalysis>,
    
    #[account(mut)]
    pub ai_oracle: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimCarbonCredits<'info> {
    #[account(
        mut,
        seeds = [b"investment", user.key().as_ref(), project.id.to_le_bytes().as_ref()],
        bump = investment.bump
    )]
    pub investment: Account<'info, Investment>,
    
    pub project: Account<'info, Project>,
    
    #[account(mut)]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(
        seeds = [b"platform"],
        bump = platform_state.bump
    )]
    pub platform_state: Account<'info, PlatformState>,
    
    #[account(mut)]
    pub carbon_token_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub user_carbon_token_account: Account<'info, TokenAccount>,
    
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct EmergencyAction<'info> {
    #[account(mut)]
    pub platform_state: Account<'info, PlatformState>,
    
    pub authority: Signer<'info>,
}

// Data structures
#[account]
#[derive(InitSpace)]
pub struct PlatformState {
    pub authority: Pubkey,
    pub carbon_token_mint: Pubkey,
    pub ai_oracle_authority: Pubkey,
    pub investment_fee_bps: u16,
    pub min_ai_confidence: u8,
    pub total_projects: u64,
    pub total_investments: u64,
    pub total_carbon_credits: u64,
    pub total_trees_planted: u64,
    pub total_co2_offset: u64,
    pub emergency_pause: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Project {
    pub id: u64,
    pub creator: Pubkey,
    #[max_len(100)]
    pub name: String,
    #[max_len(500)]
    pub description: String,
    pub location: ProjectLocation,
    pub target_trees: u64,
    pub target_funding: u64,
    pub current_funding: u64,
    pub trees_planted: u64,
    pub carbon_credits_issued: u64,
    pub carbon_credit_rate: u64,
    pub total_co2_offset: u64,
    pub ai_prediction_data: AIPredictionData,
    pub verification_requirements: VerificationRequirements,
    pub status: ProjectStatus,
    pub created_at: i64,
    pub last_verification: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct UserProfile {
    pub owner: Pubkey,
    #[max_len(50)]
    pub username: String,
    #[max_len(200)]
    pub bio: Option<String>,
    #[max_len(100)]
    pub location: Option<String>,
    pub total_invested: u64,
    pub carbon_offset: u64,
    pub projects_supported: u32,
    pub investment_tier: InvestmentTier,
    pub level: u8,
    pub last_claim: i64,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Investment {
    pub investor: Pubkey,
    pub project_id: u64,
    pub amount: u64,
    pub investment_type: InvestmentType,
    pub carbon_credit_multiplier: u16,
    pub timestamp: i64,
    pub status: InvestmentStatus,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct AIAnalysis {
    pub project_id: u64,
    pub timestamp: i64,
    pub analysis_data: ForestAnalysisData,
    pub prediction_data: AIPredictionData,
    pub bump: u8,
}

// Enums and complex types
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub struct ProjectLocation {
    #[max_len(50)]
    pub country: String,
    #[max_len(50)]
    pub region: String,
    pub latitude: f64,
    pub longitude: f64,
    pub area_hectares: u32,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub struct AIPredictionData {
    pub confidence_score: u8,
    pub co2_sequestration_rate: u32,
    pub survival_probability: u8,
    pub optimal_species: [u8; 32],
    pub climate_suitability: u8,
    pub soil_quality: u8,
    pub water_availability: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub struct VerificationRequirements {
    pub satellite_monitoring: bool,
    pub ground_verification: bool,
    pub third_party_audit: bool,
    pub community_reporting: bool,
    pub verification_frequency_days: u16,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub struct AIVerificationData {
    pub confidence_score: u8,
    pub health_score: u8,
    pub health_multiplier: u16,
    pub tree_age_factor: u8,
    pub deforestation_detected: bool,
    pub anomaly_score: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub struct ForestAnalysisData {
    pub health_score: u8,
    pub biodiversity_index: u8,
    pub deforestation_risk: u8,
    pub canopy_coverage: u8,
    pub soil_carbon_content: u16,
    pub water_stress_level: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum ProjectStatus {
    Active,
    Funded,
    InProgress,
    Completed,
    Verified,
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum InvestmentType {
    Standard,
    Premium,
    VIP,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum InvestmentStatus {
    Active,
    Claimed,
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum InvestmentTier {
    Bronze,
    Silver,
    Gold,
    Platinum,
    Diamond,
}

// Events
#[event]
pub struct PlatformInitialized {
    pub authority: Pubkey,
    pub carbon_token_mint: Pubkey,
    pub ai_oracle_authority: Pubkey,
}

#[event]
pub struct ProjectCreated {
    pub project_id: u64,
    pub creator: Pubkey,
    pub name: String,
    pub target_funding: u64,
    pub target_trees: u64,
    pub ai_confidence: u8,
    pub location: ProjectLocation,
}

#[event]
pub struct InvestmentMade {
    pub investor: Pubkey,
    pub project_id: u64,
    pub amount: u64,
    pub investment_type: InvestmentType,
    pub total_project_funding: u64,
    pub carbon_credit_multiplier: u16,
}

#[event]
pub struct ProjectProgressUpdated {
    pub project_id: u64,
    pub trees_planted: u64,
    pub total_trees: u64,
    pub carbon_credits_issued: u64,
    pub co2_offset: u64,
    pub ai_confidence: u8,
    pub health_score: u8,
    pub satellite_data_hash: String,
}

#[event]
pub struct AIAnalysisSubmitted {
    pub project_id: u64,
    pub health_score: u8,
    pub biodiversity_index: u8,
    pub deforestation_risk: u8,
    pub confidence_score: u8,
    pub co2_sequestration_rate: u32,
}

#[event]
pub struct CarbonCreditsClaimed {
    pub user: Pubkey,
    pub project_id: u64,
    pub amount: u64,
    pub total_offset: u64,
    pub investment_tier: InvestmentType,
}

#[event]
pub struct EmergencyPause {
    pub timestamp: i64,
}

#[event]
pub struct EmergencyResume {
    pub timestamp: i64,
}

// Error codes
#[error_code]
pub enum ErrorCode {
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
    #[msg("Invalid investment amount")]
    InvalidInvestmentAmount,
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
}