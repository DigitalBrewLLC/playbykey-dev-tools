import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { server } from './server.js';

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

process.on('SIGINT', () => {
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

main().catch((error: unknown) => {
  process.stderr.write(`theory-mcp: fatal error\n${String(error)}\n`);
  process.exit(1);
});
