import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { View20 } from '@carbon/icons-react';

import { settings } from '../../../constants/Settings';

import ViewItemPropType from './ViewItemPropTypes';

const { iotPrefix } = settings;

const propTypes = {
  isCompact: PropTypes.bool.isRequired,
  activeViewEdited: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  item: ViewItemPropType.isRequired,
  i18n: PropTypes.shape({
    view: PropTypes.string,
    edited: PropTypes.string,
  }).isRequired,
};

const ViewDropdownItem = ({
  item: { customAction, text, icon: Icon },
  isSelected,
  activeViewEdited,
  i18n,
  isCompact,
}) => {
  const showEdited = isSelected && activeViewEdited && !customAction;
  const editedPostfix = ` - ${i18n.edited}`;
  return (
    <div
      title={`${text}${showEdited ? editedPostfix : ''}`}
      className={classNames(`${iotPrefix}--view-dropdown__item`, {
        [`${iotPrefix}--view-dropdown__item-link`]: customAction,
      })}
    >
      {isSelected && !isCompact ? (
        <span className={`${iotPrefix}--view-dropdown__button-prefix`}>
          <View20 />
          <span>{`${i18n.view}: `}</span>
        </span>
      ) : null}
      <span>
        {text}
        {showEdited ? (
          <span className={`${iotPrefix}--view-dropdown__edited-text`}>{editedPostfix}</span>
        ) : null}
      </span>
      {Icon && !isCompact ? (
        <Icon
          className={classNames({
            [`${iotPrefix}--view-dropdown__item-link-icon`]: customAction,
          })}
        />
      ) : null}
    </div>
  );
};

ViewDropdownItem.propTypes = propTypes;

export default ViewDropdownItem;
