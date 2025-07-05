import { useEffect, useReducer, useState } from 'preact/hooks';
import { EntryInput } from './EntryInput';
import { loadAll, store } from './store';

const shortened = (str: string) => {
  if (str.length <= 20) return str;
  return str.slice(0, 17) + '...';
};

export const Main = () => {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    loadAll();
  }, []);

  const onSave = (entry: Entry) => {
    // entry.id ??= Date.now();
    // entry.title = entry.title || shortened(entry.content);
    // const newEntries = [...entries];
    // const index = newEntries.findIndex(e => e.id === entry.id);
    // if (~index) {
    //   newEntries[index] = entry;
    // } else {
    //   newEntries.push(entry);
    // }
    // setEntries(newEntries);
    // saveEntries(newEntries);
  };

  const onDelete = (id: number) => {
  };

  return (
    <>
      <header className="container-fluid">
        <h1>Ыъ.</h1>
      </header>
      <main className="container-fluid">
        <form>
          <fieldset role="group">
            <h3>Title (optional)</h3>
            <h3>Content</h3>
          </fieldset>

          {store.ids.value.map((id) => <EntryInput id={id} key={id} />)}

          <EntryInput />

          <fieldset role="group">
            <button type="button">+</button>
          </fieldset>
          <button type="submit" style={{ marginTop: '3rem' }}>Save</button>
        </form>
      </main>
    </>
  );
};
