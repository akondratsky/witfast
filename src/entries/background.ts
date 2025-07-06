import { disposeMenu, refreshMenu } from '../menu';

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
  return true; // Keep the message channel open for sendResponse
});

chrome.runtime.onRestartRequired.addListener(async () => {
  await disposeMenu();
});
