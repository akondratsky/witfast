import type { IEntry } from 'src/common/IEntry';

export const config = {
  setEntries: async (entries: IEntry[]) => {
    await chrome.storage.local.set({
      entries,
    });
  },

  getEntries: async (): Promise<IEntry[]> => {
    const { entries } = await chrome.storage.local.get('entries');
    return entries || [];
  },

  mergeEntries: async (entries: IEntry[]) => {
    const existingEntries = await config.getEntries();
    const mergedEntries = [...existingEntries, ...entries].reduce((acc, entry) => {
      acc[entry.id] = entry;
      return acc;
    }, {} as Record<string, IEntry>);
    const merged = Object.values(mergedEntries);
    await config.setEntries(merged);
  },
};
