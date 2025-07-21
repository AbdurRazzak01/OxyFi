import { FC, useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { CO2OffsetContract, ReminderService } from '../utils/co2OffsetContract';

interface GoalBuilderProps {}

export const GoalBuilder: FC<GoalBuilderProps> = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [monthlyContribution, setMonthlyContribution] = useState<number>(35);
  const [isAutomated, setIsAutomated] = useState<boolean>(false);
  const [automationType, setAutomationType] = useState<'smart-contract' | 'reminder'>('reminder');
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Constants for CO₂ calculation
  const YEARLY_CO2_TONS = 4.2;
  const COST_PER_TON = 100; // £100 per ton of CO₂
  const YEARLY_TARGET = YEARLY_CO2_TONS * COST_PER_TON; // £420
  const MONTHS_IN_YEAR = 12;

  // Calculate suggested monthly amount
  const suggestedMonthly = Math.ceil(YEARLY_TARGET / MONTHS_IN_YEAR);
  
  // Calculate how much funding is achieved per year with current contribution
  const yearlyFunding = monthlyContribution * MONTHS_IN_YEAR;
  const co2Offset = yearlyFunding / COST_PER_TON;

  useEffect(() => {
    // Simulate some progress (in a real app, this would come from blockchain/database)
    const currentProgress = (yearlyFunding / YEARLY_TARGET) * 100;
    setProgress(Math.min(currentProgress, 100));
  }, [monthlyContribution, yearlyFunding, YEARLY_TARGET]);

  const handleAutomationToggle = () => {
    setIsAutomated(!isAutomated);
    if (!isAutomated && wallet.connected) {
      // Default to smart contract if wallet is connected
      setAutomationType('smart-contract');
    } else {
      setAutomationType('reminder');
    }
  };

  const handleSetupAutomation = async () => {
    if (!wallet.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    
    try {
      if (automationType === 'smart-contract') {
        // Set up smart contract automation
        const contract = new CO2OffsetContract(connection);
        const solAmount = monthlyContribution / 100; // Convert £ to SOL (demo rate)
        
        const transaction = await contract.createOffsetGoal(
          wallet.publicKey,
          solAmount,
          YEARLY_CO2_TONS
        );
        
        // In a real implementation, we would sign and send this transaction
        if (wallet.signTransaction) {
          // const signedTx = await wallet.signTransaction(transaction);
          // const signature = await connection.sendRawTransaction(signedTx.serialize());
          // await connection.confirmTransaction(signature);
          
          alert('Smart contract automation set up successfully! (Demo mode - transaction not actually sent)');
          console.log('Transaction created:', transaction);
        }
      } else {
        // Set up local reminders
        const hasPermission = await ReminderService.requestPermission();
        if (hasPermission) {
          ReminderService.scheduleMonthlyReminder(monthlyContribution);
          alert('Monthly reminder notifications enabled!');
        } else {
          alert('Notification permission denied. Please enable notifications in your browser settings.');
        }
      }
    } catch (error) {
      console.error('Error setting up automation:', error);
      alert('Failed to set up automation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-900 rounded-xl border border-gray-700 shadow-2xl">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            🌱
          </div>
          <h2 className="text-3xl font-bold text-white">Goal Builder</h2>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-semibold mb-2">Offset my yearly CO₂</h3>
          <div className="flex items-center justify-center gap-4 text-lg">
            <span className="text-2xl font-bold">{YEARLY_CO2_TONS} tons</span>
            <span>–</span>
            <span className="text-2xl font-bold text-yellow-300">fund £{YEARLY_TARGET}</span>
          </div>
          <p className="text-green-100 mt-2 text-sm">
            Help combat climate change through verified carbon offset projects
          </p>
        </div>
      </div>

      {/* Monthly Contribution Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-white mb-4">Monthly Contribution</h4>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Amount (£)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">£</span>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                min="1"
                max="1000"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setMonthlyContribution(suggestedMonthly)}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                Suggested: £{suggestedMonthly}
              </button>
              <button
                onClick={() => setMonthlyContribution(20)}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
              >
                £20
              </button>
              <button
                onClick={() => setMonthlyContribution(50)}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
              >
                £50
              </button>
            </div>
          </div>
        </div>

        {/* Impact Calculation */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4">Your Impact</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Monthly:</span>
              <span className="text-white font-semibold">£{monthlyContribution}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Yearly Total:</span>
              <span className="text-white font-semibold">£{yearlyFunding}</span>
            </div>
            <div className="flex justify-between border-t border-gray-600 pt-3">
              <span className="text-gray-300">CO₂ Offset:</span>
              <span className="text-green-400 font-bold">{co2Offset.toFixed(1)} tons</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Goal Progress:</span>
              <span className="text-blue-400 font-bold">{progress.toFixed(0)}%</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {co2Offset >= YEARLY_CO2_TONS ? 
                '🎉 Goal achieved! Consider increasing your impact.' : 
                `${(YEARLY_CO2_TONS - co2Offset).toFixed(1)} tons remaining`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Automation Section */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold text-white">Automate Monthly Offsets</h4>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAutomated}
              onChange={handleAutomationToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        {isAutomated && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  automationType === 'smart-contract' 
                    ? 'border-green-500 bg-green-900/20' 
                    : 'border-gray-600 bg-gray-700/50'
                }`}
                onClick={() => setAutomationType('smart-contract')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm">
                    ⚡
                  </div>
                  <h5 className="font-semibold text-white">Smart Contract</h5>
                </div>
                <p className="text-sm text-gray-300">
                  Automated on-chain payments via Solana smart contract. Trustless and transparent.
                </p>
                {!wallet.connected && (
                  <p className="text-xs text-yellow-400 mt-2">
                    ⚠️ Wallet connection required
                  </p>
                )}
              </div>

              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  automationType === 'reminder' 
                    ? 'border-green-500 bg-green-900/20' 
                    : 'border-gray-600 bg-gray-700/50'
                }`}
                onClick={() => setAutomationType('reminder')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm">
                    🔔
                  </div>
                  <h5 className="font-semibold text-white">Local Reminder</h5>
                </div>
                <p className="text-sm text-gray-300">
                  Monthly browser notifications to remind you to make manual contributions.
                </p>
              </div>
            </div>

                         <button
               onClick={handleSetupAutomation}
               disabled={(automationType === 'smart-contract' && !wallet.connected) || isLoading}
               className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
               {isLoading && (
                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
               )}
               {automationType === 'smart-contract' 
                 ? (isLoading ? 'Setting up Smart Contract...' : '⚡ Setup Smart Contract Automation')
                 : (isLoading ? 'Enabling Reminders...' : '🔔 Enable Monthly Reminders')
               }
             </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="flex-1 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors">
          Save Goal
        </button>
        <button className="flex-1 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all">
          Start Contributing
        </button>
      </div>

      {/* Info Footer */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
        <p className="text-sm text-gray-400 text-center">
          🌍 Carbon offsets verified through international standards • 
          📊 Track your impact in real-time • 
          🔒 Secure blockchain transactions
        </p>
      </div>
    </div>
  );
};