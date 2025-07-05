import { signal } from '@preact/signals';

export type Entry = {
  id: number | null;
  title: string;
  content: string;
};

type State = {
  ids: number[];
  entries: Record<number, Entry>;
};

export const store = {
  ids: signal<number[]>([]),
  entries: signal<Record<number, Entry>>({
    0: {
      id: Date.now(),
      title: '',
      content: '',
    },
  }),
};

export const loadAll = async () => {
  const { entries } = await chrome.storage.local.get({ entries: [] });
  console.log('Retrieved entries:', entries);
};

export const update = (entry: Entry) => {
  store.entries.value = {
    ...store.entries.value,
    [entry.id!]: entry,
  };
};

export const saveEntries = async (entries: Entry[]) => {
  await chrome.storage.local.set({ entries });
};
