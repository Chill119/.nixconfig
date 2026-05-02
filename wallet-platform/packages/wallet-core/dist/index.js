import crypto from 'node:crypto';
const chainPrefix = {
    stellar: 'G',
    soroban: 'C',
    ethereum: '0x',
    polygon: '0x',
    base: '0x',
    solana: 'So',
    cardano: 'addr1'
};
function randomHex(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}
export function createWallet(chain) {
    const id = crypto.randomUUID();
    const prefix = chainPrefix[chain];
    const address = chain === 'ethereum' || chain === 'polygon' || chain === 'base'
        ? `${prefix}${randomHex(40)}`
        : `${prefix}${randomHex(54)}`;
    return {
        id,
        chain,
        address,
        createdAt: new Date().toISOString()
    };
}
export function createPaymentRequest(wallet, amount, assetCode) {
    return {
        walletId: wallet.id,
        chain: wallet.chain,
        amount,
        assetCode,
        reference: `pay_${crypto.randomUUID()}`
    };
}
//# sourceMappingURL=index.js.map