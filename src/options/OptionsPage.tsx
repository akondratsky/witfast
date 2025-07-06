import { useEffect } from 'preact/hooks';
import { Actions } from 'src/options/Actions';
import { EntryInput } from 'src/options/EntryInput';
import { loadAll, store } from 'src/options/store';

export const OptionsPage = () => {
  useEffect(() => {
    loadAll();
  }, []);

  return (
    <>
      <main>
        <h1>Ы</h1>
        {store.error.value && (
          <div className="error">
            {store.error.value}
          </div>
        )}
        <form>
          <fieldset className="entry-row">
            <h3 className="col-title">Title (optional)</h3>
            <h3 className="col-content">Content</h3>

            <Actions />
          </fieldset>

          {store.ids.value.map((id) => <EntryInput id={id} key={id} />)}

          <EntryInput id="new" />
          <p className="note">
            * options are saved automatically
          </p>
        </form>
      </main>
    </>
  );
};
