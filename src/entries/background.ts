import { createMenu } from '../getInsertItems';

const config = chrome.storage.local.getKeys().then(k => console.log('Config keys:', k));

const MENU_ITEM = {
  INSERT: 'insert_menu',
} as const;

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

const items = createMenu();

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: MENU_ITEM.INSERT,
    title: 'Insert',
    contexts: ['editable'],
  });

  Object.keys(items).forEach((id) => {
    const { title } = items[id]!;
    console.log('Creating context menu item:', id, title);
    chrome.contextMenus.create({
      id,
      title,
      parentId: MENU_ITEM.INSERT,
      contexts: ['editable'],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  // console.log('Context menu item clicked:', info, tab);
  if (info.menuItemId === MENU_ITEM.INSERT) {
    console.log('clicked on "Say Hello" menu item');
  }
});
