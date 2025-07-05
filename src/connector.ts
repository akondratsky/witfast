import { config } from './config';
import { parse } from './parse';
import { loadAll, store } from './store';

const getJson = async () => {
  const entries = await config.getEntries();
  return JSON.stringify(entries, null, 2);
};

export const connector = {
  copyToClipboard: async () => {
    const content = await getJson();
    await navigator.clipboard.writeText(content);
  },

  saveAsFile: async () => {
    const content = await getJson();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'witfast-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importFromClipboard: async () => {
    const text = await navigator.clipboard.readText();
    console.log('reading from clipboard', text);
    const { entries, error } = parse(text);
    if (!error && entries) {
      await config.mergeEntries(entries);
      chrome.runtime.sendMessage({ type: 'refreshMenu' });
      await loadAll();
    } else {
      store.error.value = error;
      setTimeout(() => {
        store.error.value = null;
      }, 5000);
    }
  },

  importFromFile: async () => {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = e => {
      var file = (e.target as HTMLInputElement).files?.[0];
      var reader = new FileReader();

      reader.onload = async () => {
        const text = reader.result as string;
        console.log('reading from file', text);
        const { entries, error } = parse(text);
        if (!error && entries) {
          await config.mergeEntries(entries);
          chrome.runtime.sendMessage({ type: 'refreshMenu' });
          await loadAll();
        } else {
          store.error.value = error;
          setTimeout(() => {
            store.error.value = null;
          }, 5000);
        }
      };
      if (file) {
        reader.readAsText(file);
      }
    };
    input.click();
  },
};
