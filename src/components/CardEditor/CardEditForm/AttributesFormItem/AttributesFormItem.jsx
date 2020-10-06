import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Add16, Edit16, Delete16 } from '@carbon/icons-react';

import { ComposedModal, Button, List, TextInput } from '../../../../index';

const defaultProps = {
  value: [],
  i18n: {},
};

const propTypes = {
  /* value */
  value: PropTypes.arrayOf(PropTypes.shape({})),
  /* callback when image input value changes (File object) */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({}),
};

const AttributesFormItem = ({ value, onChange }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editData, setEditData] = useState({});
  const [editDataSourceId, setEditDataSourceId] = useState({});

  return (
    <>
      {showEditor ? (
        <ComposedModal
          header={{
            label: 'Attribute',
            title: 'Edit attribute',
          }}
          onSubmit={() => {
            onChange(value.filter(i => i.dataSourceId !== editDataSourceId).concat([editData]));
            setShowEditor(false);
            setEditData(null);
          }}
          onClose={() => {
            setShowEditor(false);
            setEditData(null);
          }}
        >
          <div style={{ paddingBottom: '1rem' }}>
            <TextInput
              id="attributeLabel"
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
            <TextInput
              id="attributeDataSourceId"
              labelText="Data source ID"
              light
              onChange={evt =>
                setEditData({
                  ...editData,
                  dataSourceId: evt.target.value,
                })
              }
              value={editData.dataSourceId}
            />
          </div>
          <div style={{ paddingBottom: '1rem' }}>
            <TextInput
              id="attributeUnit"
              labelText="Unit"
              light
              onChange={evt =>
                setEditData({
                  ...editData,
                  unit: evt.target.value,
                })
              }
              value={editData.unit}
            />
          </div>
        </ComposedModal>
      ) : null}
      <List
        title="Attributes"
        buttons={[
          <Button
            renderIcon={Add16}
            hasIconOnly
            size="small"
            iconDescription="Add"
            key="expandable-list-button-add"
            onClick={() =>
              onChange(
                value.concat([
                  {
                    dataSourceId: 'newAttr',
                    label: 'New',
                    unit: '%',
                  },
                ])
              )
            }
          />,
        ]}
        items={value.map(attr => ({
          id: attr.dataSourceId,
          content: {
            value: attr.label,
            rowActions: [
              <Button
                style={{ color: 'black' }}
                renderIcon={Edit16}
                hasIconOnly
                kind="ghost"
                size="small"
                onClick={() => {
                  setEditData(attr);
                  setEditDataSourceId(attr.dataSourceId);
                  setShowEditor(true);
                }}
                iconDescription="Edit"
              />,
              <Button
                style={{ color: 'black' }}
                renderIcon={Delete16}
                hasIconOnly
                kind="ghost"
                size="small"
                onClick={() => onChange(value.filter(i => i.dataSourceId !== attr.dataSourceId))}
                iconDescription="Remove"
              />,
            ],
          },
        }))}
      />
    </>
  );
};

AttributesFormItem.defaultProps = defaultProps;
AttributesFormItem.propTypes = propTypes;

export default AttributesFormItem;
