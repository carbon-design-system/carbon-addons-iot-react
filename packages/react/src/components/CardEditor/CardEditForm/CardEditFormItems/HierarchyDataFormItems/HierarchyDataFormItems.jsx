import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Add } from '@carbon/icons-react';

import { defaultDashboardEditorActionsProps } from '../../../../DashboardEditor/editorUtils';
import ContentFormItemTitle from '../ContentFormItemTitle';
import Button from '../../../../Button';
import List from '../../../../List/List';

export const isHierarchyDataItem = (dataItem) => dataItem.hasOwnProperty('resourceData');

const propTypes = {
  cardConfig: PropTypes.shape({}).isRequired,
  /** Hierarchy Data items to display */
  hierarchyDataItemListItems: PropTypes.arrayOf(PropTypes.shape({})),
  /** Handler for hierarchy data item changes */
  handleHierarchyDataItemChange: PropTypes.func.isRequired,
  /** Class name for the list */
  listClassName: PropTypes.string,
  i18n: PropTypes.shape({
    hierarchyDataItemSectionTitle: PropTypes.string,
    addHierarchyDataItemLabel: PropTypes.string,
  }),
  actions: defaultDashboardEditorActionsProps,
};

const defaultProps = {
  hierarchyDataItemListItems: [],
  listClassName: '',
  i18n: {
    hierarchyDataItemSectionTitle: 'Hierarchy Data Item',
    addHierarchyDataItemLabel: 'Add Hierarchy Data Item',
  },
  actions: defaultDashboardEditorActionsProps,
};

const HierarchyDataFormItems = ({
  cardConfig,
  hierarchyDataItemListItems,
  handleHierarchyDataItemChange,
  listClassName,
  i18n,
  actions,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const {
    onAddHierarchyDataItems,
    dataSeriesFormActions: { hasHierarchyDataItemsEnabled },
  } = actions;

  // determine if hierarchy data items are available
  const isHierarchyDataItemsEnabled = useMemo(
    () => hasHierarchyDataItemsEnabled && hasHierarchyDataItemsEnabled(cardConfig),
    [cardConfig, hasHierarchyDataItemsEnabled]
  );

  return (
    isHierarchyDataItemsEnabled && (
      <>
        <ContentFormItemTitle title={mergedI18n.hierarchyDataItemSectionTitle} />
        <Button
          kind="ghost"
          renderIcon={Add}
          size="md"
          onClick={() => onAddHierarchyDataItems(cardConfig, handleHierarchyDataItemChange)}
        >
          {mergedI18n.addHierarchyDataItemLabel}
        </Button>
        <List
          className={listClassName}
          // need to force an empty "empty state"
          emptyState={<div />}
          title=""
          items={hierarchyDataItemListItems}
        />
      </>
    )
  );
};

HierarchyDataFormItems.propTypes = propTypes;
HierarchyDataFormItems.defaultProps = defaultProps;

export default HierarchyDataFormItems;
