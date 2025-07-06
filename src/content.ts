declare global {
  interface WitFastSelection {
    start: number | null;
    end: number | null;
  }
  interface Window {
    __WITFAST_SELECTION__: {
      index: number; // 0 for first selection, -1 for second
      selection: [WitFastSelection, WitFastSelection];
      getSelection: () => WitFastSelection;
    };
  }
}

window.__WITFAST_SELECTION__ = {
  index: 0,
  selection: [{
    start: null,
    end: null,
  }, {
    start: null,
    end: null,
  }],
  getSelection: () => {
    const { index, selection } = window.__WITFAST_SELECTION__;
    return selection.at(~index)!;
  },
};

document.addEventListener('selectionchange', () => {
  const wf = window.__WITFAST_SELECTION__;
  wf.index = ~wf.index;

  const el = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
  const tagName = el?.tagName.toLocaleLowerCase();
  const isInput = tagName === 'input' || tagName === 'textarea';

  wf.selection.at(wf.index)!.start = isInput ? el.selectionStart : null;
  wf.selection.at(wf.index)!.end = isInput ? el.selectionEnd : null;
});
