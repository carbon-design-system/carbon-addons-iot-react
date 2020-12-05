import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Grid20, List20 } from '@carbon/icons-react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import omit from 'lodash/omit';

import { settings } from '../../constants/Settings';
import ComposedModal from '../ComposedModal';
import IconSwitch from '../IconSwitch/IconSwitch';
import { Search } from '../Search';
import { ContentSwitcher } from '../ContentSwitcher';
import { ComposedModalPropTypes } from '../ComposedModal/ComposedModal';

import ImageTile from './ImageTile';

const GRID = 'grid';
const LIST = 'list';

const { iotPrefix } = settings;

export const ImagePropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    /** The alt attribute of the image element */
    alt: PropTypes.string,
    /** Title to be shown above image. Defaults to file name from src. */
    title: PropTypes.string,
  })
);

const propTypes = {
  ...ComposedModalPropTypes, // eslint-disable-line react/forbid-foreign-prop-types
  /** Classname to be added to the root node */
  className: PropTypes.string,
  /** Array of the images that should be shown */
  content: ImagePropTypes,
  /** The name of the view to be selected by default */
  defaultView: PropTypes.oneOf([GRID, LIST]),
  /** The footer prop of the ComposedModalPropTypes */
  footer: ComposedModalPropTypes.footer,
  /** Callback called with selected image props when modal submit button is pressed. */
  onSubmit: PropTypes.func.isRequired,
  /** Callback called when modal close icon or cancel button is pressed */
  onClose: PropTypes.func.isRequired,
  /** The image property to be included in the search */
  searchProperty: PropTypes.string,

  /** The text of the grid button in the grid list toggle */
  gridButtonText: PropTypes.string,
  /** The text with instructions showing above the search */
  instructionText: PropTypes.string,
  /** The text of the list button in the grid list toggle */
  listButtonText: PropTypes.string,
  modalCloseIconDescriptionText: PropTypes.string,
  /** The small label text of the modal */
  modalLabelText: PropTypes.string,
  /** The large title text of the modal */
  modalTitleText: PropTypes.string,
  /** The primary button (select) text of the modal */
  modalPrimaryButtonLabelText: PropTypes.string,
  /** The secondary button (cancel) text of the modal */
  modalSecondaryButtonLabelText: PropTypes.string,
  /** The text for the search input placeHolder */
  searchPlaceHolderText: PropTypes.string,
};

const defaultProps = {
  className: '',
  content: [],
  defaultView: GRID,
  footer: {},
  searchProperty: 'id',

  gridButtonText: 'Grid',
  instructionText: 'Select the image that you want to display on this card.',
  listButtonText: 'List',
  modalLabelText: 'New image card',
  modalTitleText: 'Image gallery',
  modalPrimaryButtonLabelText: 'Select',
  modalSecondaryButtonLabelText: 'Cancel',
  modalCloseIconDescriptionText: 'Close',
  searchPlaceHolderText: 'Search image by file name',
};

const ImageGalleryModal = ({
  className,
  content,
  defaultView,
  gridButtonText,
  instructionText,
  listButtonText,
  modalCloseIconDescriptionText,
  modalLabelText,
  modalTitleText,
  modalPrimaryButtonLabelText,
  modalSecondaryButtonLabelText,
  onSubmit,
  onClose,
  searchPlaceHolderText,
  searchProperty,
  footer,
  ...composedModalProps
}) => {
  const [activeView, setActiveView] = useState(defaultView);
  const [selectedImage, setSelectedImage] = useState();
  const [filteredContent, setFilteredContent] = useState(content);

  // Need to support lazy loaded content
  useDeepCompareEffect(() => setFilteredContent(content), [content]);

  const toggleImageSelection = (imageProps) => {
    setSelectedImage((currentSelected) => {
      return currentSelected?.id === imageProps.id ? undefined : imageProps;
    });
  };

  const filterContent = (evt) => {
    const searchTerm = evt.currentTarget.value.toLowerCase();
    const filtered = content.filter((imageProps) => {
      const text = (imageProps[searchProperty] ?? '').toLowerCase();
      return text.includes(searchTerm);
    });
    setFilteredContent(filtered);
    setSelectedImage(undefined);
  };

  const baseClass = `${iotPrefix}--image-gallery-modal`;
  return (
    <ComposedModal
      type="normal"
      className={classnames(className, baseClass)}
      footer={{
        isPrimaryButtonDisabled: !selectedImage,
        primaryButtonLabel: modalPrimaryButtonLabelText,
        secondaryButtonLabel: modalSecondaryButtonLabelText,
        ...footer,
      }}
      header={{
        label: modalLabelText,
        title: modalTitleText,
      }}
      isLarge
      iconDescription={modalCloseIconDescriptionText}
      onClose={onClose}
      onSubmit={() => {
        // title only makes sense in the modal selector, not in the image card
        onSubmit(omit(selectedImage, 'title'));
      }}
      {...composedModalProps}>
      <div className={`${baseClass}__top-section`}>
        <p className={`${baseClass}__instruction-text`} alt={instructionText}>
          {instructionText}
        </p>
        <div className={`${baseClass}__search-list-view-container`}>
          <Search
            id={`${baseClass}--search`}
            onChange={filterContent}
            labelText=""
            light
            placeHolderText={searchPlaceHolderText}
          />
          <ContentSwitcher
            className={`${baseClass}__content-switcher`}
            onChange={(selected) => {
              setActiveView(selected.name);
            }}
            selectedIndex={activeView === GRID ? 0 : 1}>
            <IconSwitch
              name={GRID}
              size="large"
              text={gridButtonText}
              renderIcon={Grid20}
              index={0}
            />
            <IconSwitch
              name={LIST}
              size="large"
              text={listButtonText}
              renderIcon={List20}
              index={1}
            />
          </ContentSwitcher>
        </div>
      </div>
      <div className={`${baseClass}__flex-wrapper`}>
        <div
          className={classnames(`${baseClass}__scroll-panel`, {
            [`${baseClass}__scroll-panel--grid`]: activeView === GRID,
            [`${baseClass}__scroll-panel--list`]: activeView === LIST,
          })}>
          {filteredContent.map((imageProps) => (
            <ImageTile
              isWide={activeView === LIST}
              key={imageProps.id}
              {...imageProps}
              toggleImageSelection={() => toggleImageSelection(imageProps)}
              isSelected={selectedImage?.id === imageProps.id}
            />
          ))}
        </div>
      </div>
    </ComposedModal>
  );
};

ImageGalleryModal.propTypes = propTypes;
ImageGalleryModal.defaultProps = defaultProps;

export default ImageGalleryModal;
