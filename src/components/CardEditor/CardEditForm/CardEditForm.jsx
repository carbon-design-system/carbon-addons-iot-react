import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Code16 } from '@carbon/icons-react';

import { CARD_SIZES } from '../../../constants/LayoutConstants';
import { settings } from '../../../constants/Settings';
import { Button, TextArea, Modal, TextInput, Dropdown } from '../../../index';

const { iotPrefix } = settings;

const defaultProps = {
  value: {},
  i18n: {
    openEditorButton: 'Open JSON editor',
  },
};

const propTypes = {
  /** card data value */
  value: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /** card data errors */
  // errors: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    openEditorButton: PropTypes.string,
  }),
};

const CardEditForm = ({ value, /* errors, */ onChange, i18n }) => {
  const mergedI18N = { ...defaultProps.i18n, ...i18n };
  const [showEditor, setShowEditor] = useState(false);
  const [modalData, setModalData] = useState();

  // temporary JSON view
  const tempJSONEditor = (
    <Modal
      className="temp-json-editor"
      modalHeading="Edit JSON"
      open={showEditor}
      onClose={() => setShowEditor(false)}
      onRequestClose={() => setShowEditor(false)}
      onRequestSubmit={() => {
        setShowEditor(false);
        onChange(JSON.parse(modalData));
      }}
      primaryButtonText="Save"
      secondaryButtonText="Cancel">
      <TextArea
        labelText="Card data"
        rows={8}
        onChange={(evt) => setModalData(evt.target.value)}
        value={modalData}
      />
    </Modal>
  );

  const baseClassName = `${iotPrefix}--card-edit-form`;

  return (
    <>
      <div className={baseClassName}>
        {tempJSONEditor}
        <div className={`${baseClassName}--content`}>
          <div className={`${baseClassName}--input`}>
            <TextInput
              id="title"
              labelText="Card title"
              light
              onChange={(evt) =>
                onChange({ ...value, title: evt.target.value })
              }
              value={value.title}
            />
          </div>
          <div className={`${baseClassName}--input`}>
            <Dropdown
              id="size"
              label="Select a size"
              direction="bottom"
              itemToString={(item) => item.text}
              items={Object.keys(CARD_SIZES).map((i) => ({ id: i, text: i }))}
              light
              selectedItem={{ id: value.size, text: value.size }}
              onChange={({ selectedItem }) => {
                onChange({ ...value, size: selectedItem.id });
              }}
              titleText="Card size"
            />
          </div>
        </div>
        <div className={`${baseClassName}--footer`}>
          <Button
            kind="tertiary"
            size="small"
            renderIcon={Code16}
            onClick={() => {
              setModalData(JSON.stringify(value, null, 4));
              setShowEditor(true);
            }}>
            {mergedI18N.openEditorButton}
          </Button>
        </div>
      </div>
    </>
  );
};

CardEditForm.propTypes = propTypes;
CardEditForm.defaultProps = defaultProps;

export default CardEditForm;
