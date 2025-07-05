import { refreshMenu, ROOT_MENU_ITEM } from '../menu';

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener(async () => {
  refreshMenu();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'refreshMenu') {
    refreshMenu();
  }
  sendResponse();
  return true; // Keep the message channel open for sendResponse
});
