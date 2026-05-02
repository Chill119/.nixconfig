import crypto from 'node:crypto';

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

const chainPrefix: Record<Chain, string> = {
  stellar: 'G',
  soroban: 'C',
  ethereum: '0x',
  polygon: '0x',
  base: '0x',
  solana: 'So',
  cardano: 'addr1'
};

function randomHex(length: number): string {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

export function createWallet(chain: Chain): WalletAccount {
  const id = crypto.randomUUID();
  const prefix = chainPrefix[chain];
  const address =
    chain === 'ethereum' || chain === 'polygon' || chain === 'base'
      ? `${prefix}${randomHex(40)}`
      : `${prefix}${randomHex(54)}`;

  return {
    id,
    chain,
    address,
    createdAt: new Date().toISOString()
  };
}

export function createPaymentRequest(wallet: WalletAccount, amount: string, assetCode: string): PaymentRequest {
  return {
    walletId: wallet.id,
    chain: wallet.chain,
    amount,
    assetCode,
    reference: `pay_${crypto.randomUUID()}`
  };
}
