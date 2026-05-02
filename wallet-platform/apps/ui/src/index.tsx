export type WalletSummary = {
  chain: string;
  address: string;
  balance: string;
  riskLevel: 'low' | 'medium' | 'high';
};

export function renderWalletCard(wallet: WalletSummary): string {
  return `
<div class="wallet-card risk-${wallet.riskLevel}">
  <h3>${wallet.chain.toUpperCase()} Wallet</h3>
  <p class="address">${wallet.address}</p>
  <p class="balance">${wallet.balance}</p>
  <span class="risk">Risk: ${wallet.riskLevel}</span>
</div>`.trim();
}

export function renderWalletGrid(wallets: WalletSummary[]): string {
  return wallets.map(renderWalletCard).join('\n');
}
