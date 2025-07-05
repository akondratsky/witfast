import { watch } from 'node:fs';
import { bundle, clean, copyPublic, publicDir, srcDir } from './utils';

console.log('Starting development build');

await clean();
await Promise.all([
  bundle(),
  copyPublic(),
]);

const makeAttempt = async (text: string, promise: Promise<any>) => {
  process.stdout.write(text);
  try {
    await promise;
    process.stdout.write(' done.\n');
  } catch (error) {
    process.stderr.write(` error:\n ${error}\n`);
  }
};

const publicWatcher = watch(publicDir, { recursive: true }, async (eventType, filename) => {
  if (filename && (eventType === 'change' || eventType === 'rename')) {
    await makeAttempt(`${filename} changed, copying...`, copyPublic());
  }
});

const srcWatcher = watch(srcDir, { recursive: true }, async (eventType, filename) => {
  if (filename && (eventType === 'change' || eventType === 'rename')) {
    await makeAttempt(`${filename} changed, rebuilding...`, bundle());
  }
});

console.log('Development build complete; watching for changes');

process.on('SIGINT', () => {
  publicWatcher.close();
  srcWatcher.close();
  process.exit();
});
