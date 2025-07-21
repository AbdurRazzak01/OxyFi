import type { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { ContextProvider } from '../contexts/ContextProvider';
import { AppBar } from '../components/AppBar';
import Footer from '../components/Footer';
import { Notification } from '../components/Notification';

require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <title>OxyFi - Carbon Offsetting Platform</title>
            </Head>
            <ContextProvider>
                <div className="flex flex-col min-h-screen">
                    <Notification />
                    <AppBar />
                    <main className="flex-grow">
                        <Component {...pageProps} />
                    </main>
                    <Footer />
                </div>
            </ContextProvider>
        </>
    );
};

export default App;
