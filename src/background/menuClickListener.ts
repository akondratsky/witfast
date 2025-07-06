import { getContentById } from 'src/background/menu';

export const menuClickListener = async (
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab,
) => {
  const content = await getContentById(info.menuItemId);
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
