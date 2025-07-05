import { store, update } from './store';

type Props = {
  id?: number;
};

export const EntryInput = ({ id = 0 }: Props) => {
  const entry = store.entries.value[id]!;

  return (
    <fieldset role="group">
      <input
        value={entry.title}
        type="text"
        onInput={({ target }) => {
          const value = (target as HTMLInputElement).value;
          console.log(target, value);
          update({ ...entry, title: value });
        }}
      />
      <textarea rows={1} value={entry.content} />
      <button type="button">
        delete
      </button>
    </fieldset>
  );
};
