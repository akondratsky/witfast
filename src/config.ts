import type { IEntry } from './IEntry';

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
};
