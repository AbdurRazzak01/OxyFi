use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};

declare_id!("GreenChain11111111111111111111111111111111");

#[program]
pub mod greenchain_reforestation {
    use super::*;

    /// Initialize the GreenChain platform
    pub fn initialize_platform(
        ctx: Context<InitializePlatform>,
        platform_authority: Pubkey,
        carbon_token_mint: Pubkey,
        investment_fee_bps: u16, // basis points (100 = 1%)
    ) -> Result<()> {
        let platform_state = &mut ctx.accounts.platform_state;
        platform_state.authority = platform_authority;
        platform_state.carbon_token_mint = carbon_token_mint;
        platform_state.investment_fee_bps = investment_fee_bps;
        platform_state.total_projects = 0;
        platform_state.total_investments = 0;
        platform_state.total_carbon_credits = 0;
        platform_state.total_trees_planted = 0;
        platform_state.bump = *ctx.bumps.get("platform_state").unwrap();
        
        Ok(())
    }

    /// Create a new reforestation project
    pub fn create_project(
        ctx: Context<CreateProject>,
        project_id: u64,
        name: String,
        description: String,
        location: String,
        target_trees: u64,
        target_funding: u64,
        carbon_credit_rate: u64, // CO2 kg per tree
        ai_prediction_score: u8, // 0-100 AI confidence score
    ) -> Result<()> {
        require!(name.len() <= 100, ErrorCode::NameTooLong);
        require!(description.len() <= 500, ErrorCode::DescriptionTooLong);
        require!(location.len() <= 100, ErrorCode::LocationTooLong);
        require!(target_trees > 0, ErrorCode::InvalidTargetTrees);
        require!(target_funding > 0, ErrorCode::InvalidTargetFunding);
        require!(ai_prediction_score <= 100, ErrorCode::InvalidAIScore);

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
        project.ai_prediction_score = ai_prediction_score;
        project.status = ProjectStatus::Active;
        project.created_at = Clock::get()?.unix_timestamp;
        project.bump = *ctx.bumps.get("project").unwrap();

        platform_state.total_projects += 1;

        emit!(ProjectCreated {
            project_id,
            creator: ctx.accounts.creator.key(),
            name: project.name.clone(),
            target_funding,
            target_trees,
        });

        Ok(())
    }

    /// Invest in a reforestation project
    pub fn invest_in_project(
        ctx: Context<InvestInProject>,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidInvestmentAmount);

        let project = &mut ctx.accounts.project;
        let platform_state = &mut ctx.accounts.platform_state;
        let investor_profile = &mut ctx.accounts.investor_profile;

        require!(project.status == ProjectStatus::Active, ErrorCode::ProjectNotActive);
        require!(
            project.current_funding + amount <= project.target_funding,
            ErrorCode::ExceedsTargetFunding
        );

        // Calculate platform fee
        let fee_amount = (amount as u128 * platform_state.investment_fee_bps as u128) / 10000;
        let investment_amount = amount - fee_amount as u64;

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

        // Update platform state
        platform_state.total_investments += investment_amount;

        // Create investment record
        let investment = &mut ctx.accounts.investment;
        investment.investor = ctx.accounts.investor.key();
        investment.project_id = project.id;
        investment.amount = investment_amount;
        investment.timestamp = Clock::get()?.unix_timestamp;
        investment.bump = *ctx.bumps.get("investment").unwrap();

        emit!(InvestmentMade {
            investor: ctx.accounts.investor.key(),
            project_id: project.id,
            amount: investment_amount,
            total_project_funding: project.current_funding,
        });

        Ok(())
    }

    /// Update project progress (trees planted)
    pub fn update_project_progress(
        ctx: Context<UpdateProjectProgress>,
        trees_planted: u64,
        ai_verified: bool,
    ) -> Result<()> {
        let project = &mut ctx.accounts.project;
        let platform_state = &mut ctx.accounts.platform_state;

        require!(
            ctx.accounts.authority.key() == project.creator || 
            ctx.accounts.authority.key() == platform_state.authority,
            ErrorCode::UnauthorizedUpdate
        );

        require!(
            project.trees_planted + trees_planted <= project.target_trees,
            ErrorCode::ExceedsTargetTrees
        );

        project.trees_planted += trees_planted;
        platform_state.total_trees_planted += trees_planted;

        // Calculate carbon credits to issue
        let carbon_credits = trees_planted * project.carbon_credit_rate;
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
            ai_verified,
        });

        Ok(())
    }

    /// Initialize or update user profile
    pub fn update_user_profile(
        ctx: Context<UpdateUserProfile>,
        username: String,
        bio: Option<String>,
        location: Option<String>,
    ) -> Result<()> {
        require!(username.len() <= 50, ErrorCode::UsernameTooLong);
        if let Some(ref bio_text) = bio {
            require!(bio_text.len() <= 200, ErrorCode::BioTooLong);
        }
        if let Some(ref location_text) = location {
            require!(location_text.len() <= 100, ErrorCode::LocationTooLong);
        }

        let profile = &mut ctx.accounts.user_profile;
        profile.owner = ctx.accounts.user.key();
        profile.username = username;
        profile.bio = bio;
        profile.location = location;
        profile.level = calculate_user_level(profile.total_invested, profile.carbon_offset);
        profile.created_at = Clock::get()?.unix_timestamp;
        profile.bump = *ctx.bumps.get("user_profile").unwrap();

        Ok(())
    }

    /// Claim carbon credits from investments
    pub fn claim_carbon_credits(
        ctx: Context<ClaimCarbonCredits>,
        project_id: u64,
    ) -> Result<()> {
        let investment = &ctx.accounts.investment;
        let project = &ctx.accounts.project;
        let user_profile = &mut ctx.accounts.user_profile;

        require!(investment.investor == ctx.accounts.user.key(), ErrorCode::NotInvestor);
        require!(investment.project_id == project_id, ErrorCode::ProjectMismatch);
        require!(project.status == ProjectStatus::Completed, ErrorCode::ProjectNotCompleted);

        // Calculate carbon credits proportional to investment
        let investment_percentage = (investment.amount as u128 * 10000) / project.current_funding as u128;
        let carbon_credits = (project.carbon_credits_issued as u128 * investment_percentage) / 10000;

        // Mint carbon credit tokens to user
        let seeds = &[
            b"platform".as_ref(),
            &[ctx.accounts.platform_state.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = token::MintTo {
            mint: ctx.accounts.carbon_token_mint.to_account_info(),
            to: ctx.accounts.user_carbon_token_account.to_account_info(),
            authority: ctx.accounts.platform_state.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::mint_to(cpi_ctx, carbon_credits as u64)?;

        // Update user profile
        user_profile.carbon_offset += carbon_credits as u64;
        user_profile.level = calculate_user_level(user_profile.total_invested, user_profile.carbon_offset);

        emit!(CarbonCreditsClaimed {
            user: ctx.accounts.user.key(),
            project_id,
            amount: carbon_credits as u64,
            total_offset: user_profile.carbon_offset,
        });

        Ok(())
    }
}

// Helper function to calculate user level
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
pub struct UpdateUserProfile<'info> {
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserProfile::INIT_SPACE,
        seeds = [b"profile", user.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimCarbonCredits<'info> {
    #[account(
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

#[account]
#[derive(InitSpace)]
pub struct PlatformState {
    pub authority: Pubkey,
    pub carbon_token_mint: Pubkey,
    pub investment_fee_bps: u16,
    pub total_projects: u64,
    pub total_investments: u64,
    pub total_carbon_credits: u64,
    pub total_trees_planted: u64,
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
    #[max_len(100)]
    pub location: String,
    pub target_trees: u64,
    pub target_funding: u64,
    pub current_funding: u64,
    pub trees_planted: u64,
    pub carbon_credits_issued: u64,
    pub carbon_credit_rate: u64,
    pub ai_prediction_score: u8,
    pub status: ProjectStatus,
    pub created_at: i64,
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
    pub level: u8,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Investment {
    pub investor: Pubkey,
    pub project_id: u64,
    pub amount: u64,
    pub timestamp: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum ProjectStatus {
    Active,
    Funded,
    Completed,
    Cancelled,
}

#[event]
pub struct ProjectCreated {
    pub project_id: u64,
    pub creator: Pubkey,
    pub name: String,
    pub target_funding: u64,
    pub target_trees: u64,
}

#[event]
pub struct InvestmentMade {
    pub investor: Pubkey,
    pub project_id: u64,
    pub amount: u64,
    pub total_project_funding: u64,
}

#[event]
pub struct ProjectProgressUpdated {
    pub project_id: u64,
    pub trees_planted: u64,
    pub total_trees: u64,
    pub carbon_credits_issued: u64,
    pub ai_verified: bool,
}

#[event]
pub struct CarbonCreditsClaimed {
    pub user: Pubkey,
    pub project_id: u64,
    pub amount: u64,
    pub total_offset: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Name is too long")]
    NameTooLong,
    #[msg("Description is too long")]
    DescriptionTooLong,
    #[msg("Location is too long")]
    LocationTooLong,
    #[msg("Invalid target trees")]
    InvalidTargetTrees,
    #[msg("Invalid target funding")]
    InvalidTargetFunding,
    #[msg("Invalid AI prediction score")]
    InvalidAIScore,
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
    #[msg("Username is too long")]
    UsernameTooLong,
    #[msg("Bio is too long")]
    BioTooLong,
    #[msg("Not an investor in this project")]
    NotInvestor,
    #[msg("Project ID mismatch")]
    ProjectMismatch,
    #[msg("Project is not completed")]
    ProjectNotCompleted,
}