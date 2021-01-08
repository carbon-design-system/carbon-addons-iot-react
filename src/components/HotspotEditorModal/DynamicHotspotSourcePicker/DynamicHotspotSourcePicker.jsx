import React from 'react';
import PropTypes from 'prop-types';
import { Erase32 } from '@carbon/icons-react';
import classnames from 'classnames';

import { settings } from '../../../constants/Settings';
import { Dropdown } from '../../Dropdown';
import Button from '../../Button/Button';

const { iotPrefix } = settings;

const propTypes = {
  clearIconDescription: PropTypes.string,
  dataSourceItems: PropTypes.arrayOf(
    PropTypes.shape({
      dataSourceId: PropTypes.string,
      label: PropTypes.string,
    })
  ).isRequired,
  id: PropTypes.string,
  /** totally clear the dynamic hotspots */
  onClear: PropTypes.func.isRequired,
  onXValueChange: PropTypes.func.isRequired,
  onYValueChange: PropTypes.func.isRequired,
  selectedSourceIdX: PropTypes.string,
  selectedSourceIdY: PropTypes.string,
  testID: PropTypes.string,
  xCoordinateDropdownTitleText: PropTypes.string,
  xCoordinateDropdownLabelText: PropTypes.string,
  yCoordinateDropdownTitleText: PropTypes.string,
  yCoordinateDropdownLabelText: PropTypes.string,
};

const defaultProps = {
  clearIconDescription: 'Clear coordinate sources',
  id: 'dynamic-hotspot-source-picker',
  selectedSourceIdX: undefined,
  selectedSourceIdY: undefined,
  testID: 'dynamic-hotspot-source-picker',
  xCoordinateDropdownTitleText: 'X coordinate',
  xCoordinateDropdownLabelText: 'Select data item',
  yCoordinateDropdownTitleText: 'Y coordinate',
  yCoordinateDropdownLabelText: 'Select data item',
};

/**
 * This component renders a form where the user can selection which dataSources to use
 * for the X and Y positions
 */
const DynamicHotspotSourcePicker = ({
  clearIconDescription,
  dataSourceItems,
  id,
  onClear,
  onXValueChange,
  onYValueChange,
  selectedSourceIdX,
  selectedSourceIdY,
  testID,
  xCoordinateDropdownTitleText,
  xCoordinateDropdownLabelText,
  yCoordinateDropdownTitleText,
  yCoordinateDropdownLabelText,
}) => {
  const classname = `${iotPrefix}--dynamic-hotspot-source-picker`;
  return (
    <div data-testid={testID} className={classname}>
      <Dropdown
        key={`${id}-x-coordinate-dropdown-${selectedSourceIdX}`}
        data-testid={`${testID}-x-coordinate-dropdown`}
        selectedItem={dataSourceItems.find(
          (item) => item.dataSourceId === selectedSourceIdX
        )}
        id={`${id}-x-coordinate-dropdown`}
        titleText={xCoordinateDropdownTitleText}
        label={xCoordinateDropdownLabelText}
        items={dataSourceItems}
        itemToString={(item) => item.label}
        onChange={(change) => {
          onXValueChange(change.selectedItem.dataSourceId);
        }}
      />
      <Dropdown
        key={`${id}-y-coordinate-dropdown-${selectedSourceIdY}`}
        data-testid={`${testID}-y-coordinate-dropdown`}
        selectedItem={dataSourceItems.find(
          (item) => item.dataSourceId === selectedSourceIdY
        )}
        id={`${id}-y-coordinate-dropdown`}
        titleText={yCoordinateDropdownTitleText}
        label={yCoordinateDropdownLabelText}
        items={dataSourceItems}
        itemToString={(item) => item.label}
        onChange={(change) => {
          onYValueChange(change.selectedItem.dataSourceId);
        }}
      />
      {
        <Button
          data-testid={`${testID}-clear-dropdown`}
          className={classnames(`${classname}__clear-button`, {
            [`${classname}__clear-button--invisible`]:
              !selectedSourceIdX || !selectedSourceIdY,
          })}
          kind="ghost"
          size="small"
          renderIcon={Erase32}
          iconDescription={clearIconDescription}
          tooltipPosition="top"
          tooltipAlignment="end"
          onClick={onClear}
          hasIconOnly
        />
      }
    </div>
  );
};

DynamicHotspotSourcePicker.propTypes = propTypes;
DynamicHotspotSourcePicker.defaultProps = defaultProps;
export default DynamicHotspotSourcePicker;
