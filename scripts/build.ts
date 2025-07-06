import { bundle, clean, copyPublic } from './utils';

await clean();
await Promise.all([
  bundle(),
  copyPublic(),
]);
