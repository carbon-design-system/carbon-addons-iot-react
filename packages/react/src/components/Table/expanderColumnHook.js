import { useState, useEffect } from 'react';

import { visibleColumnsHaveWidth } from './TableHead/columnWidthUtilityFunctions';

/**
 * The expander column will grow when the fixed layout table grows in order to keep
 * defined column widths. For resizable tables that don't have any initial
 * column widths we have to keep the expander column out of the first
 * render cycle, where column widths are measured, so that it won't be
 * assigned a width (and occupy space).
 * @param {*} hasResize true f the table has resizable columns
 * @param {*} useAutoTableLayoutForResize true for table-layout should be 'auto' instead of 'fixed'
 * @param {array} ordering the table ordering prop that specifies the order and visibility of columns
 * @param {array} columns The table column props*
 * @returns
 */
export const useShowExpanderColumn = ({
  hasResize,
  useAutoTableLayoutForResize,
  ordering,
  columns,
}) => {
  const [showDelayedExpander, setShowDelayedExpander] = useState(false);

  useEffect(() => {
    if (hasResize && !useAutoTableLayoutForResize) {
      setShowDelayedExpander(true);
    }
  });

  const showExpanderImmediately =
    hasResize && !useAutoTableLayoutForResize && visibleColumnsHaveWidth(ordering, columns);

  return showExpanderImmediately || showDelayedExpander;
};
