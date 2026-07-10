import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: false,
  noExternal: [/@modelcontextprotocol\/sdk/, /@playbykey\/theory/],
});
