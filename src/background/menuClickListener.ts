import { getContentById } from 'src/background/entries';
import { insertDivValue } from 'src/background/insertDivValue';
import { insertInputValue } from 'src/background/insertInputValue';

const handleError = (error: string) => {
  console.error(`WitFast Error: ${error}`);
};

export const menuClickListener = async (
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab,
) => {
  const content = await getContentById(info.menuItemId);
  if (content && tab?.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [content],
      func: ((content: string) => {
        const activeElem = document.activeElement;

        if (!activeElem) {
          return handleError('No active element found');
        }

        // Element handling
        switch (activeElem.tagName.toLocaleLowerCase()) {
          case 'textarea':
          case 'input':
            insertInputValue(content);
            break;
          case 'div':
            insertDivValue(content);
            break;
        }
      }) as any,
    });
  }
};
