import type { IEntry } from './IEntry';

type ParseResult = {
  entries: IEntry[] | null;
  error: string | null;
};

const getValidated = (entries: any): ParseResult => {
  if (!Array.isArray(entries)) {
    return { entries: null, error: 'Entries should be an array.' };
  }

  for (const entry of entries) {
    if (typeof entry !== 'object' || entry === null) {
      return { entries: null, error: 'Each entry should be an object.' };
    }
    const { title, content, id, ...rest } = entry;
    if (typeof title !== undefined && typeof title !== 'string') {
      return { entries: null, error: 'Entry title should be a string or undefined' };
    }
    if (typeof content !== 'string') {
      return { entries: null, error: 'Entry content should be a string.' };
    }
    if (content.length < 1) {
      return { entries: null, error: 'Entry content should not be empty.' };
    }
    if (typeof id !== 'string' || id.length < 1) {
      return { entries: null, error: 'Entry id should be a non-empty string.' };
    }
  }

  return { entries, error: null };
};

export const parse = (text: string): ParseResult => {
  try {
    const entries = JSON.parse(text);
    return getValidated(entries);
  } catch (error) {
    return {
      entries: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
