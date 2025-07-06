import { config } from 'src/common/config';

let _contentById: Record<string, string> | null = null;

export const refreshEntries = async () => {
  const entries = await config.getEntries();

  // prepare map for injections
  _contentById = entries.reduce((acc, entry) => {
    acc[String(entry.id)] = entry.content;
    return acc;
  }, {} as Record<string, string>);
  return entries;
};

export const getContentById = async (id: string | number) => {
  if (!_contentById) {
    await refreshEntries();
  }
  return _contentById![id];
};
