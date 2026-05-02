import http from 'node:http';
function randomHex(length) {
    const chars = 'abcdef0123456789';
    let out = '';
    for (let i = 0; i < length; i += 1)
        out += chars[Math.floor(Math.random() * chars.length)];
    return out;
}
function createWallet(chain) {
    const id = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    const address = `${chain}_${randomHex(40)}`;
    return { id, chain, address, createdAt: new Date().toISOString() };
}
const wallets = new Map();
async function readJson(req) {
    const chunks = [];
    for await (const chunk of req)
        chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf-8');
    return raw ? JSON.parse(raw) : {};
}
function send(res, code, payload) {
    res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
}
const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/health')
        return send(res, 200, { ok: true, service: 'wallet-backend' });
    if (req.method === 'POST' && req.url === '/wallets') {
        const { chain } = await readJson(req);
        if (typeof chain !== 'string')
            return send(res, 400, { error: 'chain is required' });
        const wallet = createWallet(chain);
        wallets.set(wallet.id, wallet);
        return send(res, 201, wallet);
    }
    if (req.method === 'POST' && req.url === '/payment-requests') {
        const { walletId, amount, assetCode } = await readJson(req);
        if (typeof walletId !== 'string' || typeof amount !== 'string' || typeof assetCode !== 'string')
            return send(res, 400, { error: 'walletId, amount, assetCode are required' });
        const wallet = wallets.get(walletId);
        if (!wallet)
            return send(res, 404, { error: 'wallet not found' });
        return send(res, 201, { walletId, chain: wallet.chain, amount, assetCode, reference: `pay_${Date.now()}` });
    }
    return send(res, 404, { error: 'not found' });
});
const port = Number(process.env.PORT ?? 8080);
server.listen(port, () => console.log(`Backend listening on ${port}`));
//# sourceMappingURL=server.js.map