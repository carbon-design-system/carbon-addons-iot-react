import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'carbon-components-react';

import { validThresholdIcons } from '../DashboardEditor/editorUtils';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const iconProptype = PropTypes.shape({
  carbonIcon: PropTypes.any,
  name: PropTypes.string,
});

const propTypes = {
  /** Array of icons to be shown */
  icons: PropTypes.arrayOf(iconProptype),
  /** The title of the Dropdown, defaults to 'Icon' */
  titleText: PropTypes.string,
  /** Required Id string */
  id: PropTypes.string.isRequired,
  /** True if the light theme is to be used, defaults to false */
  light: PropTypes.bool,
  /** Callback for when any of the Dropdown icon value changes */
  onChange: PropTypes.func.isRequired,
  /** The selected icon, use to set initial icon */
  selectedIcon: iconProptype,
  /** Id used if needed for testing */
  testID: PropTypes.string,
};

const defaultProps = {
  icons: validThresholdIcons,
  light: false,
  selectedIcon: undefined,
  testID: undefined,
  titleText: '',
};

const SimpleIconDropdown = ({
  icons,
  id,
  light,
  onChange,
  selectedIcon: selectedIconProp,
  titleText,
  testID,
}) => {
  const [selectedIcon, setSelectedIcon] = useState(selectedIconProp);

  const renderIconItem = (item) => (
    <div
      style={{ color: item.color || 'unset' }}
      className={`${iotPrefix}--icon-dropdown__item`}>
      <div className={`${iotPrefix}--icon-dropdown__item-border`}>
        {item.carbonIcon}
      </div>
    </div>
  );

  return (
    <Dropdown
      className={`${iotPrefix}--icon-dropdown`}
      id={id}
      itemToString={renderIconItem}
      items={icons}
      label=""
      light={light}
      onChange={({ selectedItem }) => {
        setSelectedIcon(selectedItem);
        onChange({ icon: selectedItem });
      }}
      selectedItem={selectedIcon || icons[0]}
      titleText={titleText}
      type="default"
      test-id={testID}
    />
  );
};

SimpleIconDropdown.propTypes = propTypes;
SimpleIconDropdown.defaultProps = defaultProps;

export default SimpleIconDropdown;
