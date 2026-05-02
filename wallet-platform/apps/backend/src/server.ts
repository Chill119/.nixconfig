import http from 'node:http';
import { createPaymentRequest, createWallet, type Chain } from '@digibank/wallet-core';

type Json = Record<string, unknown>;
const wallets = new Map<string, ReturnType<typeof createWallet>>();

async function readJson(req: http.IncomingMessage): Promise<Json> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString('utf-8');
  return raw ? (JSON.parse(raw) as Json) : {};
}

function send(res: http.ServerResponse, code: number, payload: unknown): void {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  if (!req.url || !req.method) return send(res, 400, { error: 'invalid request' });

  if (req.method === 'GET' && req.url === '/health') {
    return send(res, 200, { ok: true, service: 'wallet-backend' });
  }

  if (req.method === 'POST' && req.url === '/wallets') {
    const { chain } = await readJson(req);
    if (typeof chain !== 'string') return send(res, 400, { error: 'chain is required' });
    const wallet = createWallet(chain as Chain);
    wallets.set(wallet.id, wallet);
    return send(res, 201, wallet);
  }

  if (req.method === 'POST' && req.url === '/payment-requests') {
    const { walletId, amount, assetCode } = await readJson(req);
    if (typeof walletId !== 'string' || typeof amount !== 'string' || typeof assetCode !== 'string') {
      return send(res, 400, { error: 'walletId, amount, assetCode are required' });
    }
    const wallet = wallets.get(walletId);
    if (!wallet) return send(res, 404, { error: 'wallet not found' });
    return send(res, 201, createPaymentRequest(wallet, amount, assetCode));
  }

  return send(res, 404, { error: 'not found' });
});

const port = Number(process.env.PORT ?? 8080);
server.listen(port, () => console.log(`Backend listening on ${port}`));
