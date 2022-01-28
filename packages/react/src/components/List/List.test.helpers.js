export const getListItems = (num) =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: (idx + 1).toString(),
      content: { value: `Item ${idx + 1}` },
      isSelectable: true,
    }));
