import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { ContextProvider } from '../contexts/ContextProvider';
import { Navbar } from '../components/Navbar';
import { ContentContainer } from '../components/ContentContainer';
import { Footer } from '../components/Footer';
import Notifications from '../components/Notification'
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <>
          <Head>
            <title>Solana Scaffold Lite</title>
            <meta name="description" content="A modern Solana dApp starter built with Next.js and Tailwind CSS" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />

            <title>OxyFi - Carbon Credit Platform</title>
          </Head>

          <ContextProvider>
            <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
              <Notifications />
              <AppBar />
=======
              <Navbar/>
              <ContentContainer>
                <main className="flex-1 w-full">
                  <Component {...pageProps} />
                </main>
                <Footer />
              </ContentContainer>
            </div>
          </ContextProvider>
        </>
    );
};

export default App;
