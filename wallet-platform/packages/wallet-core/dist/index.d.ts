export type Chain = 'stellar' | 'soroban' | 'ethereum' | 'polygon' | 'base' | 'solana' | 'cardano';
export interface WalletAccount {
    id: string;
    chain: Chain;
    address: string;
    createdAt: string;
}
export interface PaymentRequest {
    walletId: string;
    chain: Chain;
    amount: string;
    assetCode: string;
    reference: string;
}
export declare function createWallet(chain: Chain): WalletAccount;
export declare function createPaymentRequest(wallet: WalletAccount, amount: string, assetCode: string): PaymentRequest;
