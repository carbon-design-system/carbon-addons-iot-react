import React from 'react';
import PropTypes from 'prop-types';
import { RadioButtonGroup, RadioButton, FormGroup, ToggleSmall } from 'carbon-components-react';

import { settings } from '../../../../../constants/Settings';
import { TextInput } from '../../../../../index';
import ColorDropdown from '../../../../ColorDropdown/ColorDropdown'

const { iotPrefix } = settings;

const propTypes = {
  /** card data value */
  cardConfig: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.shape({
      series: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          dataSourceId: PropTypes.string,
          color: PropTypes.string,
        })
      ),
      xLabel: PropTypes.string,
      yLabel: PropTypes.string,
      unit: PropTypes.string,
      includeZeroOnXaxis: PropTypes.bool,
      includeZeroOnYaxis: PropTypes.bool,
      timeDataSourceId: PropTypes.string,
    }),
    interval: PropTypes.string,
    showLegend: PropTypes.bool,
  }),
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    xAxisLabel: PropTypes.string,
    yAxisLabel: PropTypes.string,
    unitLabel: PropTypes.string,
    decimalPrecisionLabel: PropTypes.string,
    showLegendLable: PropTypes.string,
  }),
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    displayOptions: 'Image display options',
    colorTitleText: 'Background color',
    hideMap: 'Hide mini map',
    hideZoom: 'Hide zoom controls',
    zoomLevel: 'Zoom level',
  },
};

const DataSeriesFormSettings = ({ cardConfig, onChange, i18n }) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const { content, id } = cardConfig;

  const baseClassName = `${iotPrefix}--card-edit-form`;

  return (
    <>
        <div className={`${baseClassName}--input`}>
          <FormGroup legendText={mergedI18n.displayOptions}>
            <RadioButtonGroup name={`${baseClassName}--input-radios`} onChange={(evt) => onChange({
                ...cardConfig,
                content: { ...cardConfig.content, displayOption: evt },
              })
            } orientation="vertical" legend={`${mergedI18n.displayOptions}`} labelPosition='right'>
              <RadioButton value="contain" id={`${baseClassName}--input-radio-1`} labelText="Fit"/>
              <RadioButton value="cover" id={`${baseClassName}--input-radio-2`} labelText="Fill"/>
              <RadioButton value="fill" id={`${baseClassName}--input-radio-3`} labelText="Stretch"/>
            </RadioButtonGroup>
          </FormGroup>
          <ColorDropdown
            titleText={mergedI18n.colorTitleText}
            light
            id={`${baseClassName}--input-color`}
            onChange={(evt) =>
              onChange({
                ...cardConfig,
                content: { ...cardConfig.content, background: evt.color.carbonColor },
              })
            }
          />

        </div>
        <div className={`${baseClassName}--input`}>
          <div className={`${baseClassName}--input--toggle-field`}>
            <span>{mergedI18n.hideMap}</span>
            <ToggleSmall
              id={`${baseClassName}--input-toggle-1`}
              aria-label="show-legend"
              labelA=""
              labelB=""
              toggled={cardConfig.content.hideMinimap}
              onToggle={bool => onChange({ ...cardConfig, content: { ...cardConfig.content, hideMinimap: bool } })}
            />
          </div>
        </div>
        <div className={`${baseClassName}--input`}>
          <div className={`${baseClassName}--input--toggle-field`}>
            <span>{mergedI18n.hideZoom}</span>
            <ToggleSmall
              id={`${baseClassName}--input-toggle-2`}
              aria-label="show-legend"
              labelA=""
              labelB=""
              toggled={cardConfig.content.hideZoomControls}
              onToggle={bool => onChange({ ...cardConfig, content: { ...cardConfig.content, hideZoomControls: bool } })}
            />
          </div>
        </div>
    </>
  );
};

DataSeriesFormSettings.propTypes = propTypes;
DataSeriesFormSettings.defaultProps = defaultProps;

export default DataSeriesFormSettings;
