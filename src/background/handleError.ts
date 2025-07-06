export const handleError = (error: unknown): void => {
  if (error instanceof Error) {
    console.error(`WitFast Error: ${error.message}`);
  } else {
    console.error(`WitFast Error: ${String(error)}`);
  }
};
