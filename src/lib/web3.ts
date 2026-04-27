import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

let _wagmiConfig: ReturnType<typeof getDefaultConfig> | null = null;

export function getWagmiConfig() {
    if (_wagmiConfig) return _wagmiConfig;
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
    if (!projectId) return null;
    _wagmiConfig = getDefaultConfig({
        appName: '100x Komūna',
        projectId,
        chains: [base],
        ssr: true,
    });
    return _wagmiConfig;
}
