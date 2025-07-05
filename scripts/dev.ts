import { watch } from 'node:fs';
import { bundle, clean, copyPublic, publicDir, srcDir } from './utils';

console.log('Starting development build');

await clean();
await Promise.all([
  bundle(),
  copyPublic(),
]);

const publicWatcher = watch(publicDir, { recursive: true }, async (eventType, filename) => {
  if (filename && (eventType === 'change' || eventType === 'rename')) {
    process.stdout.write(`${filename} changed, copying...`);
    await copyPublic();
    process.stdout.write(' done.\n');
  }
});

const srcWatcher = watch(srcDir, { recursive: true }, async (eventType, filename) => {
  if (filename && (eventType === 'change' || eventType === 'rename')) {
    process.stdout.write(`${filename} changed, rebuilding...`);
    await bundle();
    process.stdout.write(' done.\n');
  }
});

console.log('Development build complete; watching for changes');

process.on('SIGINT', () => {
  publicWatcher.close();
  srcWatcher.close();
  process.exit();
});
