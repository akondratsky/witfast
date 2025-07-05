import { signal } from '@preact/signals';

export type Entry = {
  id: number | 'new';
  title: string;
  content: string;
};

const emptyEntry: Entry = {
  id: 'new',
  title: '',
  content: '',
};

export const store = {
  ids: signal<number[]>([]),
  entries: signal<Record<number | 'new', Entry>>({
    new: emptyEntry,
  }),
};

export const loadAll = async () => {
  const { entries } = await chrome.storage.local.get({ entries: [] });
  const entriesMap = entries.reduce((acc: Record<number | 'new', Entry>, entry: Entry) => {
    acc[entry.id] = entry;
    return acc;
  }, {});
  store.entries.value = {
    ...entriesMap,
    new: emptyEntry,
  };
  store.ids.value = entries.map((entry: Entry) => entry.id);
};

export const update = (entry: Entry) => {
  store.entries.value = {
    ...store.entries.value,
    [entry.id!]: entry,
  };
};

export const save = async () => {
  let i = 0;
  do {
    const id = store.ids.value[i] as any;
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

  chrome.storage.local.set({
    entries: store.ids.value.map(
      (id) => store.entries.value[id],
    ),
  });
};

export const remove = (id: number) => {
  const newState = { ...store.entries.value };
  delete newState[id];
  store.entries.value = newState;
  store.ids.value = store.ids.value.filter((entryId) => entryId !== id);
  save();
};

const create = () => {
  if (!store.entries.value.new.content) {
    return;
  }
  const id = Date.now();
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
  save();
};

export const upsert = (id: number | 'new') => {
  if (id === 'new') {
    create();
  } else {
    save();
  }
};
