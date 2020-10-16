import React from 'react';
import { Move16 } from '@carbon/icons-react';

import { Button } from '../../..';
import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

/* this component is only used internally where props are defined and set. */
const BulkActionHeader = ({
  className,
  i18n /* eslint-disable-line react/prop-types */,
  editModeSelectedIds /* eslint-disable-line react/prop-types */,
  cancelMoveClicked /* eslint-disable-line react/prop-types */,
  setShowModal /* eslint-disable-line react/prop-types */,
}) => (
  <div className={className}>
    <div className={`${iotPrefix}--hierarchy-list-bulk-header--title`}>
      {editModeSelectedIds.length > 1
        ? i18n.itemsSelected.replace('%d', editModeSelectedIds.length)
        : i18n.itemSelected}
    </div>
    <div
      className={`${iotPrefix}--hierarchy-list-bulk-header--button-container`}>
      <Button
        className={`${iotPrefix}--hierarchy-list-bulk-header--button`}
        renderIcon={Move16}
        onClick={() => {
          setShowModal(true);
        }}>
        {i18n.move}
      </Button>

      <div className={`${iotPrefix}--hierarchy-list-bulk-header--divider`} />

      <Button
        className={`${iotPrefix}--hierarchy-list-bulk-header--button-no-icon`}
        onClick={cancelMoveClicked}>
        {i18n.cancel}
      </Button>
    </div>
  </div>
);

export default BulkActionHeader;
