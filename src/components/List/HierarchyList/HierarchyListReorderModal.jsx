import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BreadcrumbItem, RadioButton } from 'carbon-components-react';

import { Button } from '../../..';
import ComposedModal from '../../ComposedModal/ComposedModal';
import BreadCrumb from '../../Breadcrumb/Breadcrumb';
import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  /** ListItems to be displayed */
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** Internationalization text */
  i18n: PropTypes.shape({
    allRows: PropTypes.string,
    modalTitle: PropTypes.string,
    modalDescription: PropTypes.string,
  }),
  /**   Close the dialog */
  onClose: PropTypes.func.isRequired,
  /** Callback to submit the dialog/form */
  onSubmit: PropTypes.func,
  /**  Is data currently being sent to the backend */
  sendingData: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  /** Should the dialog be open or not */
  open: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
};

const defaultProps = {
  i18n: {
    itemsSelected: '%d items selected',
    itemSelected: '%d item selected',
    itemTitle: 'Move %d item underneath',
    itemsTitle: 'Move %d items underneath',
    cancel: 'Cancel',
    allRows: 'All rows',
  },
  sendingData: null,
  onSubmit: () => {},
  open: false,
};

const HierarchyListReorderModal = ({
  i18n,
  items,
  sendingData,
  selectedIds,
  open,
  onClose,
  onSubmit,
}) => {
  const [selectedParentPath, setSelectedParentPath] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const onLineItemClicked = item => {
    if (item.children && item.children.length > 0) {
      setSelectedParentPath([...selectedParentPath, item.id]);
      setSelectedItem(null);
    } else {
      setSelectedItem(item.id);
    }
  };

  const renderRadioTile = item => {
    return selectedIds.find(id => id === item.id) ? null : (
      <div
        className={`${iotPrefix}--hierarchy-list-bulk-modal--list-item`}
        key={`${item.id}-bulk-reorder-list-item-${item.content.value}`}
      >
        <RadioButton
          className={`${iotPrefix}--hierarchy-list-bulk-modal--radio`}
          name={item.id}
          key={`radio-${item.content.value}`}
          value={item.content.value}
          hideLabel
          labelText={item.content.value}
          onChange={() => {
            setSelectedItem(item.id);
          }}
          tabIndex={0}
          checked={item.id === selectedItem}
        />

        <div
          role="button"
          className={`${iotPrefix}--hierarchy-list-bulk-modal--list-item-button`}
          tabIndex={0}
          onClick={() => onLineItemClicked(item)}
          onKeyPress={({ key }) => key === 'Enter' && onLineItemClicked(item)}
        >
          <div className={`${iotPrefix}--hierarchy-list-bulk-modal--list-item-value`}>
            {item.content.value}
          </div>
        </div>
      </div>
    );
  };

  const renderRadioButtonGroup = selectedItems => {
    return (
      <div className={`${iotPrefix}--hierarchy-list-bulk-modal--list`}>
        {selectedItems?.map(item => {
          return renderRadioTile(item);
        })}
      </div>
    );
  };

  const renderBreadCrumbItem = (item, isCurrent) => {
    const title = item === null ? i18n.allRows : item.content.value;
    const id = item === null ? 'all' : item.id;

    return (
      <BreadcrumbItem
        className={`${iotPrefix}--hierarchy-list-bulk-modal--breadcrumb`}
        title={title}
        key={`breadcrumb-${id}-${title}`}
        isCurrentPage={isCurrent}
      >
        <Button
          className={`${iotPrefix}--hierarchy-list-bulk-modal-- breadcrumb-button`}
          kind="ghost"
          onClick={() => {
            if (isCurrent) {
              return;
            }

            const index = selectedParentPath.findIndex(pathItem => pathItem === item?.id);

            if (item !== null && index >= 0) {
              setSelectedParentPath(selectedParentPath.slice(0, index + 1));
            } else {
              setSelectedParentPath([]);
            }
          }}
        >
          {title}
        </Button>
      </BreadcrumbItem>
    );
  };

  const getBreadCrumbData = (breadcrumbs, selectedItems, path, pathIndex) => {
    if (pathIndex < path.length) {
      const breadCrumbItem = selectedItems.find(item => item.id === path[pathIndex]);

      return getBreadCrumbData(
        [...breadcrumbs, breadCrumbItem],
        breadCrumbItem.children,
        path,
        pathIndex + 1
      );
    }

    return breadcrumbs;
  };

  const renderContent = () => {
    const breadcrumbData = getBreadCrumbData([], items, selectedParentPath, 0);
    const group =
      breadcrumbData.length > 0 ? breadcrumbData[breadcrumbData.length - 1].children : items;

    const renderedCrumbs = [];

    renderedCrumbs.push(renderBreadCrumbItem(null, selectedParentPath.length === 0));

    breadcrumbData.forEach((crumb, index) => {
      renderedCrumbs.push(renderBreadCrumbItem(crumb, index === breadcrumbData.length - 1));
    });

    return (
      <>
        <BreadCrumb data-testid="modal-breadcrumb">{renderedCrumbs}</BreadCrumb>
        {renderRadioButtonGroup(group)}
      </>
    );
  };

  return (
    <ComposedModal
      className={`${iotPrefix}--hierarchy-list-bulk-modal`}
      open={open}
      header={{
        title:
          selectedIds.length > 1
            ? `${i18n.itemsTitle.replace('%d', selectedIds?.length ?? '')}`
            : `${i18n.itemTitle.replace('%d', selectedIds?.length ?? '')}`,
      }}
      onClose={() => {
        setSelectedParentPath([]);
        setSelectedItem(null);
        onClose();
      }}
      onSubmit={() => {
        onSubmit(selectedItem);

        setSelectedParentPath([]);
        setSelectedItem(null);
      }}
      sendingData={sendingData}
    >
      <div className={`${iotPrefix}--hierarchy-list-bulk-modal--title`}>
        {i18n.modalDescription}
      </div>
      {renderContent()}
    </ComposedModal>
  );
};

HierarchyListReorderModal.propTypes = propTypes;
HierarchyListReorderModal.defaultProps = defaultProps;

export default HierarchyListReorderModal;
