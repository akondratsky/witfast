import { bundle, clean, copyPublic } from './utils';

export const build = async () => {
  await clean();
  await Promise.all([
    bundle(),
    copyPublic(),
  ]);
};
