import { config } from 'src/common/config';

export const ROOT_MENU_ITEM = 'insert_menu';

const shortened = (str: string) => {
  if (str.length <= 20) return str;
  return str.slice(0, 17) + '...';
};

let _contentById: Record<string, string> | null = null;

const ensureEntries = async () => {
  const entries = await config.getEntries();

  // prepare map for injections
  _contentById = entries.reduce((acc, entry) => {
    acc[String(entry.id)] = entry.content;
    return acc;
  }, {} as Record<string, string>);
  return entries;
};

export const getContentById = async (id: string | number) => {
  if (!_contentById) {
    await ensureEntries();
  }
  return _contentById![id];
};

export const disposeMenu = async () => {
  await chrome.contextMenus.removeAll();
};

export const refreshMenu = async () => {
  const entries = await ensureEntries();

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
};
