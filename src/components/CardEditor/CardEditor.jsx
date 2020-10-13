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
  cardJson: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /** validation errors on the cardJson object */
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
    addCardButton: PropTypes.string,
  }),
};

const defaultProps = {
  cardJson: null,
  // errors: null,
  i18n: {
    galleryHeader: 'Gallery',
    addCardButton: 'Add card',
    closeGalleryButton: 'Back',
    openJSONButton: 'Open JSON editor',
  },
  supportedTypes: [],
};

const CardEditor = ({
  cardJson,
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
  const showGallery = cardJson === null || cardJson === undefined;

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
            {mergedI18N.addCardButton}
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
          <CardEditForm cardJson={cardJson} onChange={onChange} /* onAddImage={onAddImage} */ />
        )}
      </div>
    </div>
  );
};

CardEditor.propTypes = propTypes;
CardEditor.defaultProps = defaultProps;

export default CardEditor;
