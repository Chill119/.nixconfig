declare module 'node:http' {
  export interface IncomingMessage extends AsyncIterable<Uint8Array> { url?: string; method?: string; }
  export interface ServerResponse { writeHead(code: number, headers: Record<string,string>): void; end(body?: string): void; }
  export function createServer(handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>): { listen(port: number, cb?: () => void): void };
  const _default: { createServer: typeof createServer };
  export default _default;
}
declare const Buffer: {
  concat(chunks: Uint8Array[]): { toString(encoding: string): string };
};
declare const process: { env: Record<string, string | undefined> };
