type MenuItem = {
  title: string;
  content: string;
};

type Menu = Record<string, MenuItem>;

export const createMenu = (): Menu => {
  return {
    insert_item1: {
      title: 'Insert Item 2',
      content: 'Insert Item 1!',
    },
  };
};
