import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, TransactionSignature } from '@solana/web3.js';
import { FC, useCallback, useState } from 'react';
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';

export const RequestAirdrop: FC = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const { getUserSOLBalance } = useUserSOLBalanceStore();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = useCallback(async () => {
        if (!publicKey) {
            console.log('error', 'Wallet not connected!');
            notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
            return;
        }

        setIsLoading(true);
        let signature: TransactionSignature = '';

        try {
            signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);

            // Get the latest block hash to use on our transaction and confirmation
            let latestBlockhash = await connection.getLatestBlockhash()
            await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');

            notify({ type: 'success', message: 'Airdrop successful!', txid: signature });

            getUserSOLBalance(publicKey, connection);
        } catch (error: any) {
            notify({ type: 'error', message: `Airdrop failed!`, description: error?.message, txid: signature });
            console.log('error', `Airdrop failed! ${error?.message}`, signature);
        } finally {
            setIsLoading(false);
        }
    }, [publicKey, connection, getUserSOLBalance]);

    return (
        <div className="flex flex-row justify-center w-full px-4">
            <div className="relative group items-center">
                {/* Gradient glow effect */}
                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 
                rounded-lg blur opacity-20 group-hover:opacity-100 transition-all duration-300 group-hover:duration-200 animate-pulse-subtle"></div>
        
                <button
                    className={`
                        relative px-6 py-3 md:px-8 md:py-3 m-2 btn text-sm md:text-base font-medium
                        bg-gradient-to-r from-purple-600 to-pink-600 
                        hover:from-purple-700 hover:to-pink-700 
                        disabled:from-gray-400 disabled:to-gray-500
                        text-white border-none rounded-lg
                        transition-all duration-200 ease-in-out
                        transform hover:scale-105 active:scale-95
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                        shadow-lg hover:shadow-xl
                        min-w-[140px] md:min-w-[160px]
                        ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    onClick={onClick}
                    disabled={isLoading || !publicKey}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">Requesting...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center space-x-2">
                            <svg 
                                className="w-4 h-4 md:w-5 md:h-5" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" 
                                />
                            </svg>
                            <span>Airdrop 1 SOL</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
};

