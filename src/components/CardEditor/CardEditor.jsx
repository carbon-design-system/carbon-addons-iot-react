import React from 'react';
import PropTypes from 'prop-types';
import { Apps16 } from '@carbon/icons-react';

import { Button } from '../../index';
import { settings } from '../../constants/Settings';

import CardGalleryList from './CardGalleryList/CardGalleryList';
import CardEditForm from './CardEditForm/CardEditForm';

const { iotPrefix } = settings;

const propTypes = {
  /** card data being edited */
  value: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /** validation errors on the value object */
  // errors: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /** Callback function when user clicks Show Gallery */
  onShowGallery: PropTypes.func.isRequired,
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  /** Callback function when card is added from list */
  onAddCard: PropTypes.func.isRequired,
  /** Callback function when an image file is uploaded */
  // onAddImage: PropTypes.func.isRequired,
  supportedTypes: PropTypes.arrayOf(PropTypes.string),
  i18n: PropTypes.shape({
    galleryHeader: PropTypes.string,
    openGalleryButton: PropTypes.string,
  }),
};

const defaultProps = {
  value: null,
  // errors: null,
  i18n: {
    galleryHeader: 'Gallery',
    openGalleryButton: 'Open gallery',
    closeGalleryButton: 'Back',
    openJSONButton: 'Open JSON editor',
  },
  supportedTypes: [],
};

const CardEditor = ({
  value,
  onShowGallery,
  onChange,
  onAddCard,
  // onAddImage,
  supportedTypes,
  i18n,
}) => {
  const mergedI18N = { ...defaultProps.i18n, ...i18n };

  const baseClassName = `${iotPrefix}--card-editor`;

  // show the gallery if no card is being edited
  const showGallery = value === null || value === undefined;

  return (
    <div className={baseClassName}>
      {!showGallery ? (
        <div className={`${baseClassName}--header`}>
          <Button
            className="gallery-button"
            kind="ghost"
            size="small"
            renderIcon={Apps16}
            onClick={onShowGallery}
          >
            {mergedI18N.openGalleryButton}
          </Button>
        </div>
      ) : null}
      <div className={`${baseClassName}--content`}>
        {showGallery ? (
          <CardGalleryList
            onAddCard={onAddCard}
            supportedTypes={supportedTypes}
            i18n={mergedI18N}
          />
        ) : (
          <CardEditForm value={value} onChange={onChange} /* onAddImage={onAddImage} */ />
        )}
      </div>
    </div>
  );
};

CardEditor.propTypes = propTypes;
CardEditor.defaultProps = defaultProps;

export default CardEditor;
