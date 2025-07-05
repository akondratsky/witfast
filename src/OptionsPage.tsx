import { useEffect } from 'preact/hooks';
import { EntryInput } from './EntryInput';
import { loadAll, store } from './store';

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
          <p>
            * options are saved automatically
          </p>
        </form>
      </main>
    </>
  );
};
