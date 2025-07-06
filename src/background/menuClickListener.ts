import { getContentById } from 'src/background/entries';

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
        const handleError = (error: unknown): void => {
          if (error instanceof Error) {
            console.error(`WitFast Error: ${error.message}`);
          } else {
            console.error(`WitFast Error: ${String(error)}`);
          }
        };

        const activeElem = document.activeElement;

        if (!activeElem) {
          return handleError('No active element found');
        }

        // Element handling
        switch (activeElem.tagName.toLocaleLowerCase()) {
          case 'textarea':
          case 'input':
            const el = document.activeElement as HTMLInputElement | HTMLTextAreaElement;

            let newValue = content;

            if (el.selectionStart !== null && el.selectionEnd !== null) {
              const start = el.selectionStart;
              const end = el.selectionEnd;
              const before = el.value.substring(0, start);
              const after = el.value.substring(end);
              newValue = el.value = before + content + after;
              const actualLength = el.tagName.toLocaleLowerCase() === 'input'
                ? content.replace(/\n/g, '').length
                : content.length;
              el.selectionStart = el.selectionEnd = start + actualLength;
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
            break;

          case 'div':
            /**
             * Based on similar project for firefox (copied from it),
             * @link https://github.com/kyuucr/insert-template-to-editables/blob/master/content-script.js
             * Might be useful for some WYSIWYG editors in theory.
             */

            // For editable div, use DOM manipulation
            // Create nodes to be inserted
            const splitMessage = content.split(/\n/);
            let insertNodes = [];
            for (let i = 0; i < splitMessage.length; i++) {
              const text = splitMessage[i];
              if (text) {
                insertNodes.push(document.createTextNode(text));
              }
              if (i !== splitMessage.length - 1) {
                insertNodes.push(document.createElement('br'));
              }
            }

            const selection = window.getSelection();

            if (!selection || selection.rangeCount === 0) {
              return handleError('No selection found');
            }

            // Set range of nodes to be deleted
            const selectionRange = selection.getRangeAt(0);
            let startOffset = selectionRange.startOffset;
            let endOffset = selectionRange.endOffset;
            let parentNode, startDelete, endDelete;
            if (selectionRange.startContainer.childNodes.length > 0) {
              parentNode = selectionRange.startContainer;
              startDelete = selectionRange.startContainer.childNodes[startOffset];
              startOffset = -1; // Mark delete whole node
            } else {
              parentNode = selectionRange.startContainer.parentNode;
              startDelete = selectionRange.startContainer;
            }
            if (selectionRange.endContainer.childNodes.length > 0) {
              endDelete = selectionRange.endContainer.childNodes[endOffset];
              endOffset = -1; // Mark delete whole node
            } else {
              endDelete = selectionRange.endContainer;
            }

            if (!parentNode) {
              return handleError('No parent node found');
            }

            // Get nodes to be deleted
            const deleteNodes = [];
            let deleteMode = false;
            for (let i = 0; i < parentNode.childNodes.length; i++) {
              if (parentNode.childNodes[i] === startDelete) {
                deleteMode = true;
              }
              if (deleteMode) {
                deleteNodes.push(parentNode.childNodes[i]);
              }
              if (deleteMode && parentNode.childNodes[i] === endDelete) {
                break;
              }
            }

            // Start deleting
            let insertAnchor = null;
            if (deleteNodes.length > 1) {
              for (let i = 0; i < deleteNodes.length; i++) {
                const node = deleteNodes[i];
                if (!node) {
                  return handleError('Node not found');
                }
                if (i === 0) {
                  if (startOffset > 0) {
                    const prefixSplit = node.textContent?.substring(0, startOffset);
                    if (!prefixSplit) {
                      return handleError('Prefix split is empty');
                    }

                    parentNode.replaceChild(document.createTextNode(prefixSplit), node);
                  } else {
                    parentNode.removeChild(node);
                  }
                } else if (i === deleteNodes.length - 1) {
                  if (endOffset > 0) {
                    const textContent = node.textContent;
                    if (!textContent) {
                      return handleError('Text content is empty');
                    }
                    const suffixSplit = textContent.substring(endOffset, textContent.length);
                    insertAnchor = document.createTextNode(suffixSplit);
                    parentNode.replaceChild(insertAnchor, node);
                  } else {
                    insertAnchor = node.nextSibling;
                    parentNode.removeChild(node);
                  }
                } else {
                  parentNode.removeChild(node);
                }
              }
            } else if (deleteNodes.length === 1) {
              if (startOffset !== -1) {
                const firstNode = deleteNodes[0];
                if (!firstNode) {
                  return handleError('First node not found');
                }
                const textContent = firstNode.textContent;
                if (!textContent) {
                  return handleError('Text content is empty');
                }
                let prefixSplit = textContent.substring(0, startOffset);
                let suffixSplit = textContent.substring(endOffset, textContent.length);
                parentNode.insertBefore(document.createTextNode(prefixSplit), firstNode);
                insertAnchor = parentNode.insertBefore(document.createTextNode(suffixSplit), firstNode);
                parentNode.removeChild(firstNode);
              } else {
                insertAnchor = deleteNodes[0];
              }
            }

            // Begin insertion
            for (let i = 0; i < insertNodes.length; i++) {
              const node = insertNodes[i];
              if (!node || !insertAnchor) {
                return handleError('Node to insert is empty');
              }
              parentNode.insertBefore(node, insertAnchor);
            }
            break;
        }
      }) as any,
    });
  }
};
