import { createPublicClient, http, formatUnits } from 'viem';
import { base } from 'viem/chains';

const publicClient = createPublicClient({ chain: base, transport: http() });

const MINTINS_ADDRESS = '0xDE65f89596F88F02bE141B663cae662ed32cb08F' as const;

const ERC20_ABI = [
    { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
    { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
] as const;

export async function getMintinsBalance(walletAddress: string): Promise<number | null> {
    try {
        const [rawBalance, decimals] = await Promise.all([
            publicClient.readContract({ address: MINTINS_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf', args: [walletAddress as `0x${string}`] }),
            publicClient.readContract({ address: MINTINS_ADDRESS, abi: ERC20_ABI, functionName: 'decimals' }),
        ]);
        return parseFloat(formatUnits(rawBalance as bigint, decimals as number));
    } catch {
        return null;
    }
}
