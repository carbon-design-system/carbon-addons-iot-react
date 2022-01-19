import React from 'react';

import { settings } from '../../constants/Settings';
import icons from '../../utils/bundledIcons';

const { prefix } = settings;

/**
 * Use this function to traverse the tree structure of a set of table rows using Depth-first search (DFS)
 * and apply some function on each row. The function is applied once the recursion starts back-tracking.
 * @param rows The root node of your search space, an array of rows.
 * @param functionToApply Any function that should be applied on every row. Params are a row and an optional aggregatorObj.
 * @param aggregatorObj Used as a container to aggregate the result (e.g. a count or needle) if needed.
 */
export const tableTraverser = (rows, functionToApply, aggregatorObj) => {
  rows.forEach((row) => {
    if (row.children) {
      tableTraverser(row.children, functionToApply, aggregatorObj);
    }
    functionToApply(row, aggregatorObj);
  });
};

export const findRow = (rowId, myRows) => {
  const result = [];
  const applyFunc = (row, aggr) => {
    if (row.id === rowId) {
      aggr.push(row);
    }
  };
  tableTraverser(myRows, applyFunc, result);
  return result[0];
};

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

export const renderBundledIconUsingName = (iconName, label) => {
  const Icon = icons[iconName];
  return <Icon aria-label={label} />;
};

/**
 * Helper method to render the itemText on OverflowMenuItems in the rowActions or
 * in the TableToolbar.
 *
 * @param {Object} obj The object containing the following props
 *     className the className to be applied to the wrapper div when an icon is render
 *     action The renderIcon and the labelText to create be used in the itemText prop
 *
 * @returns string|Element
 */
export const renderTableOverflowItemText = ({ action, className }) => {
  return action.renderIcon ? (
    <>
      <div className={className} title={action.labelText}>
        {typeof action.renderIcon === 'string' ? (
          renderBundledIconUsingName(action.renderIcon, action.labelText)
        ) : (
          <action.renderIcon description={action.labelText} />
        )}
      </div>
      <div className={`${prefix}--overflow-menu-options__option-content`}>{action.labelText}</div>
    </>
  ) : (
    action.labelText
  );
};
