export type WalletSummary = {
    chain: string;
    address: string;
    balance: string;
    riskLevel: 'low' | 'medium' | 'high';
};
export declare function renderWalletCard(wallet: WalletSummary): string;
export declare function renderWalletGrid(wallets: WalletSummary[]): string;
