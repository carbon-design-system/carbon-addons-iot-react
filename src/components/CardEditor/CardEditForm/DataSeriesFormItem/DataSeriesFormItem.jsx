import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Edit16 } from '@carbon/icons-react';

import { settings } from '../../../../constants/Settings';
import { ComposedModal, Button, List, TextInput, MultiSelect } from '../../../../index';

const { iotPrefix } = settings;

const defaultProps = {
  value: [],
  availableDataSourceIds: [],
  i18n: {},
};

const propTypes = {
  /* value */
  value: PropTypes.arrayOf(PropTypes.shape({})),
  /* extensions supported for upload */
  availableDataSourceIds: PropTypes.arrayOf(PropTypes.string),
  /* callback when image input value changes (File object) */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({}),
};

const DataSeriesFormItem = ({ value = [], availableDataSourceIds, onChange }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editData, setEditData] = useState({});

  const baseClassName = `${iotPrefix}--card-edit-form`;

  return (
    <>
      {showEditor ? (
        <ComposedModal
          header={{
            title: 'Edit data series',
          }}
          onSubmit={() => {
            onChange(value.map(i => (i.dataSourceId === editData.dataSourceId ? editData : i)));
            setShowEditor(false);
            setEditData(null);
          }}
          onClose={() => {
            setShowEditor(false);
            setEditData(null);
          }}
        >
          <div style={{ paddingBottom: '1rem' }}>{editData.dataSourceId}</div>
          <div style={{ paddingBottom: '1rem' }}>
            <TextInput
              id="seriesLabel"
              labelText="Label"
              light
              onChange={evt =>
                setEditData({
                  ...editData,
                  label: evt.target.value,
                })
              }
              value={editData.label}
            />
          </div>
          <div style={{ paddingBottom: '1rem' }}>
            <div>Legend color</div>
            <div className="color-picker">
              {['red', 'green', 'blue', 'yellow'].map(color => (
                <button
                  type="button"
                  style={{ backgroundColor: color }}
                  className={`color-picker-button ${
                    color === editData.color ? 'color-picker-button__selected' : ''
                  }`}
                  onClick={() => setEditData({ ...editData, color })}
                />
              ))}
            </div>
          </div>
        </ComposedModal>
      ) : null}
      <div className={`${baseClassName}--form-section`}>Data series</div>
      <div className={`${baseClassName}--input`}>
        <MultiSelect
          id="dataSourceIds"
          label="Select data items"
          direction="bottom"
          itemToString={item => item.text}
          items={availableDataSourceIds.map(i => ({ id: i, text: i }))}
          light
          initialSelectedItems={value.map(i => ({ id: i.dataSourceId, text: i.dataSourceId }))}
          onChange={({ selectedItems }) => {
            // construct new series array, duplicating existing configuration if the dataSourceId
            // already existed
            const newValue = selectedItems
              .map(i => i.id)
              .map(dataSourceId => ({
                dataSourceId,
                label: dataSourceId,
                ...(value.find(i => i.dataSourceId === dataSourceId) ?? {}),
              }));
            onChange(newValue);
          }}
          titleText="Data item"
        />
      </div>
      <List
        items={value.map(series => ({
          id: series.dataSourceId,
          content: {
            value: series.dataSourceId,
            icon: <div style={{ width: '1rem', height: '1rem', backgroundColor: series.color }} />,
            rowActions: [
              <Button
                style={{ color: 'black' }}
                renderIcon={Edit16}
                hasIconOnly
                kind="ghost"
                size="small"
                onClick={() => {
                  setEditData(series);
                  setShowEditor(true);
                }}
                iconDescription="Edit"
              />,
            ],
          },
        }))}
      />
    </>
  );
};

DataSeriesFormItem.defaultProps = defaultProps;
DataSeriesFormItem.propTypes = propTypes;

export default DataSeriesFormItem;
