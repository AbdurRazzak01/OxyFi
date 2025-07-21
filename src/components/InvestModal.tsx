import React, { FC, useState, useCallback, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction
} from '@solana/web3.js';
// SPL Token imports - commented out for compatibility
// import { 
//   createMint,
//   getOrCreateAssociatedTokenAccount,
//   mintTo,
//   TOKEN_PROGRAM_ID,
//   ASSOCIATED_TOKEN_PROGRAM_ID
// } from '@solana/spl-token';
import { notify } from '../utils/notifications';

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}

type Currency = 'SOL' | 'USDC';

// Carbon token conversion rates (mock rates) - moved outside component to avoid re-creation
const CARBON_TOKEN_RATES = {
  SOL: 100, // 1 SOL = 100 Carbon tokens
  USDC: 1,  // 1 USDC = 1 Carbon token
};

export const InvestModal: FC<InvestModalProps> = ({ 
  isOpen, 
  onClose, 
  projectName = "OxyFi Carbon Impact Project" 
}) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>('SOL');
  const [isLoading, setIsLoading] = useState(false);
  const [investmentConfirmed, setInvestmentConfirmed] = useState(false);
  const [carbonTokensReceived, setCarbonTokensReceived] = useState<number>(0);

  // Mock USDC mint address for devnet/testnet
  const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v for mainnet

  const carbonTokensToReceive = useMemo(() => {
    const numAmount = parseFloat(amount) || 0;
    return numAmount * CARBON_TOKEN_RATES[currency];
  }, [amount, currency]);

  const validateAmount = useCallback(() => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      notify({ type: 'error', message: 'Please enter a valid amount' });
      return false;
    }
    if (currency === 'SOL' && numAmount < 0.001) {
      notify({ type: 'error', message: 'Minimum SOL investment is 0.001 SOL' });
      return false;
    }
    if (currency === 'USDC' && numAmount < 1) {
      notify({ type: 'error', message: 'Minimum USDC investment is 1 USDC' });
      return false;
    }
    return true;
  }, [amount, currency]);

  const createCarbonTokenMint = useCallback(async () => {
    if (!publicKey) return null;
    
    try {
      // Mock implementation - in a real app, this would create an actual SPL token mint
      // For demo purposes, we'll simulate the mint creation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Return a mock mint address
      const mockMintAddress = new PublicKey('CarbonTokenMint1111111111111111111111111');
      
      notify({ 
        type: 'success', 
        message: 'Mock Carbon Token mint created successfully!' 
      });
      
      return mockMintAddress;
    } catch (error) {
      console.error('Error creating carbon token mint:', error);
      notify({ type: 'error', message: 'Failed to create carbon token mint' });
      return null;
    }
  }, [connection, publicKey]);

  const mintCarbonTokens = useCallback(async (mintAddress: PublicKey, amount: number) => {
    if (!publicKey) return false;

    try {
      // Mock implementation - in a real app, this would mint actual SPL tokens
      // For demo purposes, we'll simulate the minting process
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      // Create a mock transaction signature
      const mockSignature = 'MockTxSignature' + Date.now() + Math.random().toString(36).substr(2, 9);

      notify({ 
        type: 'success', 
        message: `Successfully minted ${amount} OxyFi Carbon Impact Tokens!`,
        txid: mockSignature
      });

      return true;
    } catch (error) {
      console.error('Error minting carbon tokens:', error);
      notify({ type: 'error', message: 'Failed to mint carbon tokens' });
      return false;
    }
  }, [connection, publicKey]);

  const simulateSOLInvestment = useCallback(async () => {
    if (!publicKey || !validateAmount()) return false;

    const amountInLamports = parseFloat(amount) * LAMPORTS_PER_SOL;
    
    try {
      // Create a mock transaction to simulate investment
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey('11111111111111111111111111111112'), // System program (burn address)
          lamports: Math.floor(amountInLamports * 0.01), // Only charge 1% as demo fee
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      notify({ 
        type: 'success', 
        message: `Investment of ${amount} SOL confirmed!`,
        txid: signature
      });

      return true;
    } catch (error) {
      console.error('SOL investment error:', error);
      notify({ type: 'error', message: 'Failed to process SOL investment' });
      return false;
    }
  }, [publicKey, amount, sendTransaction, connection, validateAmount]);

  const simulateUSDCInvestment = useCallback(async () => {
    if (!publicKey || !validateAmount()) return false;

    try {
      // In a real implementation, this would involve USDC token transfer
      // For simulation, we'll just create a simple transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey('11111111111111111111111111111112'),
          lamports: 5000, // Small fee for demo
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      notify({ 
        type: 'success', 
        message: `Investment of ${amount} USDC confirmed!`,
        txid: signature
      });

      return true;
    } catch (error) {
      console.error('USDC investment error:', error);
      notify({ type: 'error', message: 'Failed to process USDC investment' });
      return false;
    }
  }, [publicKey, amount, sendTransaction, connection, validateAmount]);

  const handleInvest = useCallback(async () => {
    if (!connected) {
      notify({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (!validateAmount()) return;

    setIsLoading(true);
    
    try {
      // Step 1: Process investment
      let investmentSuccess = false;
      if (currency === 'SOL') {
        investmentSuccess = await simulateSOLInvestment();
      } else {
        investmentSuccess = await simulateUSDCInvestment();
      }

      if (!investmentSuccess) {
        setIsLoading(false);
        return;
      }

      // Step 2: Create carbon token mint (in real app, this would be pre-existing)
      const carbonMint = await createCarbonTokenMint();
      if (!carbonMint) {
        setIsLoading(false);
        return;
      }

      // Step 3: Mint carbon tokens to user
      const mintSuccess = await mintCarbonTokens(carbonMint, carbonTokensToReceive);
      
      if (mintSuccess) {
        setInvestmentConfirmed(true);
        setCarbonTokensReceived(carbonTokensToReceive);
        
        // Auto-close modal after 3 seconds
        setTimeout(() => {
          onClose();
          setInvestmentConfirmed(false);
          setAmount('');
        }, 3000);
      }
    } catch (error) {
      console.error('Investment process error:', error);
      notify({ type: 'error', message: 'Investment process failed' });
    } finally {
      setIsLoading(false);
    }
  }, [
    connected,
    validateAmount,
    currency,
    simulateSOLInvestment,
    simulateUSDCInvestment,
    createCarbonTokenMint,
    mintCarbonTokens,
    carbonTokensToReceive,
    onClose
  ]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setAmount('');
      setInvestmentConfirmed(false);
      setCarbonTokensReceived(0);
      onClose();
    }
  }, [isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Invest in {projectName}
            </h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Success State */}
          {investmentConfirmed && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Investment Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You have received <span className="font-bold text-green-600">{carbonTokensReceived}</span> OxyFi Carbon Impact Tokens
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Closing automatically in 3 seconds...
              </p>
            </div>
          )}

          {/* Investment Form */}
          {!investmentConfirmed && (
            <>
              {/* Wallet Connection */}
              {!connected && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-blue-800 dark:text-blue-200 mb-3 text-center">
                    Connect your wallet to start investing
                  </p>
                  <div className="flex justify-center">
                    <WalletMultiButton className="btn btn-primary" />
                  </div>
                </div>
              )}

              {/* Currency Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Choose Investment Currency
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['SOL', 'USDC'] as Currency[]).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      disabled={isLoading}
                      className={`p-3 rounded-lg border-2 font-medium transition-all ${
                        currency === curr
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                      } disabled:opacity-50`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Investment Amount ({currency})
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Enter ${currency} amount`}
                  min="0"
                  step={currency === 'SOL' ? '0.001' : '1'}
                  disabled={isLoading}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Minimum: {currency === 'SOL' ? '0.001 SOL' : '1 USDC'}
                </p>
              </div>

              {/* Expected Returns */}
              {amount && parseFloat(amount) > 0 && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                    Expected Carbon Impact Tokens
                  </h4>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {carbonTokensToReceive.toLocaleString()} Tokens
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Rate: 1 {currency} = {CARBON_TOKEN_RATES[currency]} Tokens
                  </p>
                </div>
              )}

              {/* Project Info */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  About This Investment
                </h4>
                                 <p className="text-sm text-gray-600 dark:text-gray-300">
                   Your investment supports carbon offset projects and renewable energy initiatives. 
                   You&apos;ll receive OxyFi Carbon Impact Tokens representing your environmental contribution.
                 </p>
              </div>

              {/* Invest Button */}
              <button
                onClick={handleInvest}
                disabled={!connected || isLoading || !amount || parseFloat(amount) <= 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Investment...
                  </>
                ) : (
                  `Invest ${amount || '0'} ${currency}`
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestModal;