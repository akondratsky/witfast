import { connector } from 'src/options/connector';

export const Actions = () => {
  return (
    <>
      <section class="actions">
        <button
          type="button"
          className="action"
          title="Download options as JSON"
          onClick={connector.saveAsFile}
        >
          Export
        </button>
        <button
          type="button"
          className="action"
          title="Import options from JSON file"
          onClick={connector.importFromFile}
        >
          Import
        </button>
      </section>
      <section class="actions">
        <button
          type="button"
          className="action"
          title="Copy as JSON to clipboard"
          onClick={connector.copyToClipboard}
        >
          Copy
        </button>
        <button
          type="button"
          className="action"
          title="Paste from JSON from clipboard"
          onClick={connector.importFromClipboard}
        >
          Paste
        </button>
      </section>
    </>
  );
};
