import { build, file, write } from 'bun';
import { exists, readdir, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';

export const publicDir = join(process.cwd(), 'public');
export const srcDir = join(process.cwd(), 'src');
export const outDir = join(process.cwd(), 'dist');

export const clean = async () => {
  if (await exists(outDir)) {
    await rm(outDir, { recursive: true, force: true });
  }
};

export const bundle = () =>
  build({
    entrypoints: [
      './src/entries/content.ts',
      './src/entries/background.ts',
      './src/entries/options.tsx',
    ],
    outdir: outDir,
  });

export const copyPublic = async () => {
  const files = await readdir(publicDir);
  await Promise.all(
    files.map(filename => {
      const from = resolve(publicDir, filename);
      const to = resolve(outDir, filename);
      return write(to, file(from));
    }),
  );
};
