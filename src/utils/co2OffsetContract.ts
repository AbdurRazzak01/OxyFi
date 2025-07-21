import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export interface CO2OffsetGoal {
  monthlyAmount: number; // in lamports
  targetCO2Tons: number;
  isActive: boolean;
  lastPayment: number; // timestamp
  totalContributed: number; // in lamports
}

export class CO2OffsetContract {
  private connection: Connection;
  private programId: PublicKey;

  constructor(connection: Connection) {
    this.connection = connection;
    // In a real implementation, this would be the actual program ID
    this.programId = new PublicKey('11111111111111111111111111111111');
  }

  /**
   * Create a new CO₂ offset goal (demo implementation)
   */
  async createOffsetGoal(
    userPublicKey: PublicKey,
    monthlyAmount: number, // in SOL
    targetCO2Tons: number
  ): Promise<Transaction> {
    const transaction = new Transaction();
    
    // In a real implementation, this would be a custom instruction to our program
    // For demo purposes, we'll just create a memo transaction
    const instruction = SystemProgram.transfer({
      fromPubkey: userPublicKey,
      toPubkey: this.programId,
      lamports: 0, // Just for demonstration
    });

    transaction.add(instruction);
    
    console.log(`Creating CO₂ offset goal:
      Monthly: ${monthlyAmount} SOL
      Target: ${targetCO2Tons} tons CO₂
      User: ${userPublicKey.toBase58()}`);

    return transaction;
  }

  /**
   * Execute monthly payment (demo implementation)
   */
  async executeMonthlyPayment(
    userPublicKey: PublicKey,
    amount: number // in SOL
  ): Promise<Transaction> {
    const transaction = new Transaction();
    
    // Convert SOL to lamports
    const lamports = amount * LAMPORTS_PER_SOL;
    
    // In a real implementation, this would transfer to the offset program
    const instruction = SystemProgram.transfer({
      fromPubkey: userPublicKey,
      toPubkey: this.programId,
      lamports: lamports,
    });

    transaction.add(instruction);
    
    console.log(`Executing monthly CO₂ offset payment:
      Amount: ${amount} SOL (${lamports} lamports)
      From: ${userPublicKey.toBase58()}`);

    return transaction;
  }

  /**
   * Get user's offset goal status (demo implementation)
   */
  async getOffsetGoalStatus(userPublicKey: PublicKey): Promise<CO2OffsetGoal | null> {
    try {
      // In a real implementation, this would fetch from on-chain account data
      // For demo purposes, return mock data
      const mockGoal: CO2OffsetGoal = {
        monthlyAmount: 35 * LAMPORTS_PER_SOL, // 35 SOL in lamports
        targetCO2Tons: 4.2,
        isActive: true,
        lastPayment: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
        totalContributed: 105 * LAMPORTS_PER_SOL, // 105 SOL total
      };

      return mockGoal;
    } catch (error) {
      console.error('Error fetching offset goal:', error);
      return null;
    }
  }

  /**
   * Cancel automated payments (demo implementation)
   */
  async cancelAutomation(userPublicKey: PublicKey): Promise<Transaction> {
    const transaction = new Transaction();
    
    // In a real implementation, this would update the program state
    const instruction = SystemProgram.transfer({
      fromPubkey: userPublicKey,
      toPubkey: this.programId,
      lamports: 0,
    });

    transaction.add(instruction);
    
    console.log(`Canceling automation for user: ${userPublicKey.toBase58()}`);

    return transaction;
  }

  /**
   * Calculate CO₂ offset from SOL amount
   */
  static calculateCO2Offset(solAmount: number, solToUsdRate: number = 100): number {
    const usdAmount = solAmount * solToUsdRate;
    const costPerTon = 100; // $100 per ton of CO₂
    return usdAmount / costPerTon;
  }

  /**
   * Calculate required SOL for target CO₂ offset
   */
  static calculateRequiredSOL(co2Tons: number, solToUsdRate: number = 100): number {
    const costPerTon = 100; // $100 per ton of CO₂
    const usdRequired = co2Tons * costPerTon;
    return usdRequired / solToUsdRate;
  }
}

// Notification helpers for local reminders
export class ReminderService {
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static scheduleMonthlyReminder(amount: number): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    // Schedule notification (in a real app, this would use a service worker)
    const reminderDate = new Date();
    reminderDate.setMonth(reminderDate.getMonth() + 1);
    reminderDate.setDate(1); // First day of next month
    
    console.log(`Scheduled reminder for ${reminderDate.toDateString()}: £${amount} CO₂ offset payment`);
    
    // For demo purposes, show immediate notification
    new Notification('CO₂ Offset Reminder Set!', {
      body: `You'll be reminded to contribute £${amount} monthly to offset your carbon footprint.`,
      icon: '🌱',
    });
  }

  static showMonthlyReminder(amount: number): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    new Notification('Time for your CO₂ Offset!', {
      body: `Don't forget to contribute £${amount} this month to help combat climate change.`,
      icon: '🌍',
      requireInteraction: true,
    });
  }
}