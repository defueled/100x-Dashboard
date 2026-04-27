'use client';

import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getWagmiConfig } from '@/lib/web3';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
    const config = getWagmiConfig();

    // WalletConnect project ID not configured — render children without Web3 context
    if (!config) return <>{children}</>;

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#10b981',
                        accentColorForeground: 'white',
                        borderRadius: 'large',
                    })}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
