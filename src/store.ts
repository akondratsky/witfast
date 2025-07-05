import { signal } from '@preact/signals';
import { config } from './config';
import type { IEntry } from './IEntry';
import { refreshMenu } from './menu';

const emptyEntry: IEntry = {
  id: 'new',
  title: '',
  content: '',
};

export const store = {
  ids: signal<string[]>([]),
  entries: signal<Record<string, IEntry>>({
    new: emptyEntry,
  }),
};

export const loadAll = async () => {
  const entries = await config.getEntries();
  const entriesMap = entries.reduce((acc: Record<string, IEntry>, entry: IEntry) => {
    acc[entry.id] = entry;
    return acc;
  }, {} as Record<string, IEntry>);
  store.entries.value = {
    ...entriesMap,
    new: emptyEntry,
  };
  store.ids.value = entries.map((entry: IEntry) => entry.id);
};

export const updateValues = (entry: IEntry) => {
  store.entries.value = {
    ...store.entries.value,
    [entry.id!]: entry,
  };
};

export const saveAll = async () => {
  let i = 0;
  do {
    const id = store.ids.value[i] as string;
    const entries = { ...store.entries.value };
    const entry = store.entries.value[id];

    if (!entry) {
      store.ids.value = store.ids.value.filter((entryId) => entryId !== id);
      continue;
    }

    if (!entry.title && !entry.content) {
      delete entries[id];
      store.ids.value = store.ids.value.filter((entryId) => entryId !== id);
      store.entries.value = entries;
      continue;
    }

    i++;
  } while (i < store.ids.value.length);

  await config.setEntries(
    store.ids.value.map(
      (id) => store.entries.value[id],
    ) as IEntry[],
  );

  await refreshMenu();
};

export const removeById = (id: string) => {
  const newState = { ...store.entries.value };
  delete newState[id];
  store.entries.value = newState;
  store.ids.value = store.ids.value.filter((entryId) => entryId !== id);
  saveAll();
};

const create = () => {
  if (!store.entries.value.new?.content) {
    return;
  }
  const id = String(Date.now());
  store.entries.value = {
    ...store.entries.value,
    [id]: {
      id,
      title: store.entries.value.new.title,
      content: store.entries.value.new.content,
    },
    new: {
      id: 'new',
      title: '',
      content: '',
    },
  };
  store.ids.value = [...store.ids.value, id];
  saveAll();
};

export const upsert = (id: string) => {
  if (id === 'new') {
    create();
  } else {
    saveAll();
  }
};
