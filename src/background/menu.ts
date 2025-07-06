import { refreshEntries } from './entries';

const ROOT_MENU_ITEM = 'insert_menu';

const shortened = (str: string) => {
  if (str.length <= 20) return str;
  return str.slice(0, 17) + '...';
};

export const disposeMenu = async () => {
  await chrome.contextMenus.removeAll();
};

export const refreshMenu = async () => {
  await disposeMenu();

  const entries = await refreshEntries();

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
};
