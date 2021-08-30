export const getRowAction = (data, actionId, rowId) => {
  let item;
  for (let idx = 0; idx < data.length; idx += 1) {
    const element = data[idx];
    if (element.id === rowId) {
      item = element.rowActions.find((action) => action.id === actionId);
      if (item) {
        break;
      }
      if (Array.isArray(element?.children)) {
        item = getRowAction(element.children, actionId, rowId);
        if (item) {
          break;
        }
      }
    }
    if (Array.isArray(element?.children)) {
      item = getRowAction(element.children, actionId, rowId);
      if (item) {
        break;
      }
    }
  }
  return item;
};
