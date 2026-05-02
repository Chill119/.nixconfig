export function renderWalletCard(wallet) {
    return `
<div class="wallet-card risk-${wallet.riskLevel}">
  <h3>${wallet.chain.toUpperCase()} Wallet</h3>
  <p class="address">${wallet.address}</p>
  <p class="balance">${wallet.balance}</p>
  <span class="risk">Risk: ${wallet.riskLevel}</span>
</div>`.trim();
}
export function renderWalletGrid(wallets) {
    return wallets.map(renderWalletCard).join('\n');
}
//# sourceMappingURL=index.js.map