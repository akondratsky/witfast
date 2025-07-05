import clsx from 'clsx';
import { remove, store, update, upsert } from './store';

type Props = {
  id: number | 'new';
};

export const EntryInput = ({ id = 'new' }: Props) => {
  const entry = store.entries.value[id]!;
  const isNew = id === 'new';
  return (
    <fieldset role="group">
      <input
        value={entry.title}
        type="text"
        className="col-title"
        onInput={({ target }) => {
          const value = (target as HTMLInputElement).value;
          update({ ...entry, title: value });
        }}
      />

      <textarea
        rows={1}
        className="col-content"
        value={entry.content}
        onInput={({ target }) => {
          const value = (target as HTMLTextAreaElement).value;
          update({ ...entry, content: value });
        }}
        onBlur={() => upsert(id)}
      />

      <button
        className={clsx({ 'new': isNew })}
        type="button"
        onClick={() => remove(id as number)}
      >
        {isNew ? '+' : '-'}
      </button>
    </fieldset>
  );
};
