import { config } from './config';

export const ROOT_MENU_ITEM = 'insert_menu';

const shortened = (str: string) => {
  if (str.length <= 20) return str;
  return str.slice(0, 17) + '...';
};

let contentById: Record<string, string> = {};

export const refreshMenu = async () => {
  const entries = await config.getEntries();

  // prepare map for injections
  contentById = entries.reduce((acc, entry) => {
    acc[String(entry.id)] = entry.content;
    return acc;
  }, {} as Record<string, string>);

  await chrome.contextMenus.removeAll();

  chrome.contextMenus.create({
    id: ROOT_MENU_ITEM,
    title: 'Insert',
    contexts: ['editable'],
  });

  entries.forEach(({ id, content, title }) => {
    chrome.contextMenus.create({
      id,
      title: title || shortened(content),
      parentId: ROOT_MENU_ITEM,
      contexts: ['editable'],
    });
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    const content = contentById[info.menuItemId];
    if (content) {
      console.log('FOUND!!! WORKS!!!', content);
    }
  });
};
