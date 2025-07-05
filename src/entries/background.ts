import { refreshMenu, ROOT_MENU_ITEM } from '../menu';

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener(async () => {
  refreshMenu();
});
