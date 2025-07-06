import { disposeMenu, refreshMenu } from 'src/background/menu';
import { menuClickListener } from 'src/background/menuClickListener';

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener(async () => {
  refreshMenu();
});

chrome.runtime.onStartup.addListener(() => {
  refreshMenu();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'refreshMenu') {
    refreshMenu();
  }
  sendResponse();
  return true;
});

chrome.runtime.onRestartRequired.addListener(async () => {
  await disposeMenu();
});

chrome.contextMenus.onClicked.addListener(menuClickListener);
