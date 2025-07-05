import clsx from 'clsx';
import { removeById, store, updateValues, upsert } from './store';

type Props = {
  id: string;
};

export const EntryInput = ({ id = 'new' }: Props) => {
  const entry = store.entries.value[id]!;
  const isNew = id === 'new';
  return (
    <fieldset role="group" className="entry-row">
      <input
        value={entry.title}
        type="text"
        className="col-title"
        onInput={({ target }) => {
          const value = (target as HTMLInputElement).value;
          updateValues({ ...entry, title: value });
        }}
      />

      <textarea
        rows={1}
        className="col-content"
        value={entry.content}
        onInput={({ target }) => {
          const value = (target as HTMLTextAreaElement).value;
          updateValues({ ...entry, content: value });
        }}
        onBlur={() => upsert(id)}
      />

      <button
        className={clsx('row-button', { 'new': isNew })}
        type="button"
        onClick={() => removeById(id)}
      >
        {isNew ? '+' : <>&ndash;</>}
      </button>
    </fieldset>
  );
};
