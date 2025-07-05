import { useEffect } from 'preact/hooks';
import { EntryInput } from './EntryInput';
import { loadAll, store } from './store';

const shortened = (str: string) => {
  if (str.length <= 20) return str;
  return str.slice(0, 17) + '...';
};

export const OptionsPage = () => {
  useEffect(() => {
    loadAll();
  }, []);

  return (
    <>
      <main>
        <h1>Ы</h1>
        <form>
          <fieldset role="group">
            <h3 className="col-title">Title (optional)</h3>
            <h3 className="col-content">Content</h3>
          </fieldset>

          {store.ids.value.map((id) => <EntryInput id={id} key={id} />)}

          <EntryInput id="new" />
        </form>
      </main>
    </>
  );
};
