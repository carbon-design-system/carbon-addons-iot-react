import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Code16 } from '@carbon/icons-react';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';
import { Button, TextArea, Modal, TextInput, Select, SelectItem } from '../../index';

const { iotPrefix } = settings;

const defaultProps = {
  i18n: {
    openEditorButton: 'Open JSON editor',
  },
};

const propTypes = {
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    openEditorButton: PropTypes.string,
  }),
};

const CardEditForm = ({ onChange, i18n }) => {
  const mergedI18N = { ...defaultProps.i18n, ...i18n };
  const [data, setData] = useState({
    title: 'Untitled',
    size: CARD_SIZES.SMALL,
  });
  const [showEditor, setShowEditor] = useState(false);
  const [modalData, setModalData] = useState();

  // temporary JSON view
  const tempJSONEditor = (
    <Modal
      modalHeading="Edit JSON"
      open={showEditor}
      onClose={() => setShowEditor(false)}
      onRequestClose={() => setShowEditor(false)}
      onRequestSubmit={() => {
        setShowEditor(false);
        try {
          setData(JSON.parse(modalData));
        } catch (e) {
          console.error(e);
        }
      }}
      primaryButtonText="Save"
      secondaryButtonText="Cancel"
    >
      <TextArea onChange={evt => setModalData(evt.target.value)} value={modalData} />
    </Modal>
  );

  const baseClassName = `${iotPrefix}--card-edit-form`;

  return (
    <>
      {tempJSONEditor}
      <div className={baseClassName}>
        <div className={`${baseClassName}--content`}>
          <div className={`${baseClassName}--input`}>
            <TextInput
              id="title"
              labelText="Card title"
              light
              onChange={evt => setData({ ...data, title: evt.target.value })}
              value={data.title}
            />
          </div>
          <div className={`${baseClassName}--input`}>
            <Select
              id="size"
              labelText="Card size"
              light
              defaultValue={data.size}
              onChange={evt => setData({ ...data, size: evt.target.value })}
            >
              {Object.keys(CARD_SIZES).map(i => (
                <SelectItem text={i} value={i} />
              ))}
            </Select>
          </div>
        </div>
        <div className={`${baseClassName}--footer`}>
          <Button
            kind="tertiary"
            size="small"
            renderIcon={Code16}
            onClick={() => {
              setModalData(JSON.stringify(data));
              setShowEditor(true);
            }}
          >
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
