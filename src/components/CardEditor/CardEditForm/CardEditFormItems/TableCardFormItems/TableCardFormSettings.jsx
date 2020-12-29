import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import { settings } from '../../../../../constants/Settings';
import {
  ToggleSmall,
  Dropdown,
  RadioButton,
  RadioButtonGroup,
} from '../../../../../index';
import { TableCardPropTypes } from '../../../../../constants/CardPropTypes';

const { iotPrefix } = settings;

const propTypes = {
  /** card data value */
  cardConfig: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.string,
    type: PropTypes.string,
    content: TableCardPropTypes.content,
  }),
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    rowsPerPage: PropTypes.string,
    sortBy: PropTypes.string,
    sortByDataItem: PropTypes.string,
    ascending: PropTypes.string,
    descending: PropTypes.string,
    showHeader: PropTypes.string,
    allowNavigation: PropTypes.string,
  }),
  /** an object where the keys are available dimensions and the values are the values available for those dimensions
   *  ex: { manufacturer: ['Rentech', 'GHI Industries'], deviceid: ['73000', '73001', '73002'] }
   */
  availableDimensions: PropTypes.shape({}),
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    rowsPerPage: 'Rows per page',
    sortBy: 'Sort by',
    sortByTitle: 'Sort by data item',
    ascending: 'Ascending',
    descending: 'Descending',
    showHeader: 'Show table header',
    allowNavigation: 'Allow navigation to assets',
  },
  availableDimensions: {},
};

const TableCardFormSettings = ({ cardConfig, onChange, i18n }) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const { content, id } = cardConfig;

  const baseClassName = `${iotPrefix}--card-edit-form`;
  const dataItems = useMemo(
    () =>
      Array.isArray(content?.columns)
        ? content?.columns.map((column) => column.label)
        : [],
    [content]
  );

  // default to timestamp sort
  const [sortByValue, setSortByValue] = useState('timestamp');

  return (
    <>
      {/* This is handled by the card. Do we want to override this or will it mess with the grid layout?
      <div className={`${baseClassName}--input`}>
        <Dropdown
            id={`${cardConfig.id}_rows_per_page`}
            direction="bottom"
            label={mergedI18n.rowsPerPage}
            light
            titleText={mergedI18n.rowsPerPage}
            items={[]}
            selectedItem={cardConfig.content?.categoryDataSourceId}
            onChange={({ selectedItem }) => {
              onChange({
                ...cardConfig,
                content: {
                  ...cardConfig.content,
                  timeDataSourceId: 'timestamp',
                  categoryDataSourceId: selectedItem,
                },
                dataSource: {
                  ...cardConfig.dataSource,
                  groupBy: [selectedItem],
                },
              });
            }}
          />
      </div> */}
      {!isEmpty(cardConfig?.content?.columns) ? (
        <>
          <div className={`${baseClassName}--input`}>
            <Dropdown
              id={`${id}_sort_by_dropdown`}
              titleText={mergedI18n.sortBy}
              direction="bottom"
              hideLabel
              label={mergedI18n.sortBy}
              items={dataItems}
              light
              selectedItem={sortByValue}
              onChange={({ selectedItem }) => {
                setSortByValue(selectedItem);
              }}
            />
          </div>
          <div className={`${baseClassName}--input`}>
            <RadioButtonGroup
              name={`${baseClassName}--input-radios`}
              onChange={(evt) =>
                onChange({
                  ...cardConfig,
                  content: { ...cardConfig.content, sort: evt },
                })
              }
              orientation="vertical"
              legend={`${mergedI18n.descending}`}
              labelPosition="right"
              valueSelected={cardConfig.content?.displayOption}>
              <RadioButton
                data-testid={`${baseClassName}--input-radio1`}
                value="DESC"
                id={`${baseClassName}--input-radio-1`}
                labelText={mergedI18n.descending}
              />
              <RadioButton
                data-testid={`${baseClassName}--input-radio2`}
                value="ASC"
                id={`${baseClassName}--input-radio-2`}
                labelText={mergedI18n.ascending}
              />
            </RadioButtonGroup>
          </div>
        </>
      ) : null}
      <div className={`${baseClassName}--input`}>
        <div className={`${baseClassName}--input--toggle-field`}>
          <span>{mergedI18n.showHeader}</span>
          <ToggleSmall
            data-testid={`${baseClassName}--input-toggle1`}
            id={`${baseClassName}--input-toggle-1`}
            aria-label={mergedI18n.showHeader}
            labelA=""
            labelB=""
            toggled={cardConfig.content?.showHeader ?? true}
            onToggle={(bool) =>
              onChange({
                ...cardConfig,
                content: { ...cardConfig.content, showHeader: bool },
              })
            }
          />
        </div>
      </div>
      <div className={`${baseClassName}--input`}>
        <div className={`${baseClassName}--input--toggle-field`}>
          <span>{mergedI18n.allowNavigation}</span>
          <ToggleSmall
            data-testid={`${baseClassName}--input-toggle2`}
            id={`${baseClassName}--input-toggle-2`}
            aria-label={mergedI18n.allowNavigation}
            labelA=""
            labelB=""
            toggled={cardConfig.content?.allowNavigation ?? false}
            onToggle={(bool) =>
              onChange({
                ...cardConfig,
                content: { ...cardConfig.content, allowNavigation: bool },
              })
            }
          />
        </div>
      </div>
    </>
  );
};

TableCardFormSettings.propTypes = propTypes;
TableCardFormSettings.defaultProps = defaultProps;

export default TableCardFormSettings;
