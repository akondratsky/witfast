import { config } from './config';

export const ROOT_MENU_ITEM = 'insert_menu';

const shortened = (str: string) => {
  if (str.length <= 20) return str;
  return str.slice(0, 17) + '...';
};

let contentById: Record<string, string> = {};
let listener: (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => void;

export const disposeMenu = async () => {
  await chrome.contextMenus.removeAll();
  if (listener) {
    chrome.contextMenus.onClicked.removeListener(listener);
  }
};

export const refreshMenu = async () => {
  const entries = await config.getEntries();

  // prepare map for injections
  contentById = entries.reduce((acc, entry) => {
    acc[String(entry.id)] = entry.content;
    return acc;
  }, {} as Record<string, string>);

  await disposeMenu();

  chrome.contextMenus.create({
    id: ROOT_MENU_ITEM,
    title: 'Insert',
    contexts: ['editable'],
    documentUrlPatterns: [
      'http://*:*/*',
      'http://*/*',
      'https://*/*',
      'https://*:*/*',
      'file:///',
    ],
  });

  entries.forEach(({ id, content, title }) => {
    chrome.contextMenus.create({
      id,
      title: title || shortened(content),
      parentId: ROOT_MENU_ITEM,
      contexts: ['editable'],
    });
  });

  listener = (info, tab) => {
    const content = contentById[info.menuItemId];
    if (content) {
      chrome.scripting.executeScript({
        target: { tabId: tab!.id! },
        args: [content],
        func: ((content: string) => {
          const el = document.activeElement as HTMLInputElement | HTMLTextAreaElement;

          let newValue = content;

          if (el.selectionStart !== null && el.selectionEnd !== null) {
            const start = el.selectionStart;
            const end = el.selectionEnd;
            const before = el.value.substring(0, start);
            const after = el.value.substring(end);
            newValue = el.value = before + content + after;
            el.selectionStart = el.selectionEnd = start + content.length;
          } else {
            el.value = newValue;
          }

          const inputEvent = new Event('input', { bubbles: true });
          const changeEvent = new Event('change', { bubbles: true });

          // Dirty fix for React: set value via native setter (ChatGPT said)
          const prototype = Object.getPrototypeOf(el);
          const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
          setter?.call(el, newValue);

          el.dispatchEvent(inputEvent);
          el.dispatchEvent(changeEvent);
        }) as any,
      });
    }
  };

  chrome.contextMenus.onClicked.addListener(listener);
};
