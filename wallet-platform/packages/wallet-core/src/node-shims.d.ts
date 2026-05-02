declare module 'node:crypto' {
  const crypto: {
    randomUUID(): string;
    randomBytes(size: number): { toString(encoding: 'hex'): string };
  };
  export default crypto;
}
