import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  FileUploaderDropContainer,
  TextInput,
  InlineNotification,
} from 'carbon-components-react';
import { Image32 } from '@carbon/icons-react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import Button from '../Button';
import { fetchDataURL } from '../../utils/cardUtilityFunctions';

const { iotPrefix } = settings;

const i18nDefaults = {
  dropContainerLabelText: 'Drag and drop file here or click to select file',
  dropContainerDescText:
    'Max file size is 1MB. Supported file types are: JPEG, PNG, GIF, WEBP, TIFF, JPEG2000',
  uploadByURLCancel: 'Cancel',
  uploadByURLButton: 'OK',
  browseImages: 'Browse images',
  insertUrl: 'Insert from URL',
  urlInput: 'Type or insert URL',
  errorTitle: 'Error: ',
  wrongFileType: (accept) =>
    `This file is not one of the accepted file types, ${accept.join(', ')}`,
};

const propTypes = {
  accept: PropTypes.arrayOf(PropTypes.string),
  onBrowseClick: PropTypes.func,
  onUpload: PropTypes.func,
  i18n: PropTypes.shape({
    dropContainerLabelText: PropTypes.string,
    dropContainerDescText: PropTypes.string,
    uploadByURLCancel: PropTypes.string,
    uploadByURLButton: PropTypes.string,
    browseImages: PropTypes.string,
    insertUrl: PropTypes.string,
    urlInput: PropTypes.string,
  }),
};

const defaultProps = {
  accept: ['JPEG', 'PNG', 'GIF', 'WEBP', 'TIFF', 'JPEG2000'],
  onBrowseClick: () => {},
  onUpload: () => {},
  i18n: i18nDefaults,
};

const ImageUploader = ({ onBrowseClick, i18n, onUpload, accept, ...other }) => {
  const [fromURL, setFromURL] = useState(false);
  const [error, setError] = useState(null);
  const [buttonSize, setButtonSize] = useState('default');
  const imgRef = useRef(null);
  useEffect(() => {
    if (other.width < 520) {
      setButtonSize('small');
    } else {
      setButtonSize('default');
    }
  }, [other.width]);

  const handleFromURLClick = () => {
    setFromURL(true);
  };

  const handleCancelFromURLClick = () => {
    setFromURL(false);
  };

  const handleUploadByURL = () => {
    const url = imgRef.current.value;
    if (url === '') {
      return;
    }
    fetchDataURL(url, setError)
      .then((imageData) => {
        if (imageData !== undefined) {
          onUpload(imageData);
        }
      })
      .catch((e) => setError(`${e.message}`));
  };

  const handleOnChange = (_event, files) => {
    const acceptedFiles = accept.map((i) => i.toLowerCase());
    if (
      acceptedFiles.includes(
        files.addedFiles[0].name
          .match(/([^.]*?)(?=\?|#|$)/ || [])[0]
          .toLowerCase()
      )
    ) {
      const fR = new FileReader();
      fR.readAsDataURL(files.addedFiles[0]);
      fR.onloadend = (event) => {
        onUpload({ files, dataURL: event.target.result });
      };
      fR.onerror = (e) => {
        setError(e.message);
      };
    } else {
      setError(i18n.wrongFileType(accept));
    }
  };

  const handleErrorClose = () => {
    setError(false);
  };

  return (
    <div
      className={classnames(`${iotPrefix}--image-uploader`, {
        [`${iotPrefix}--image-uploader__medium`]:
          other.width >= 252 && other.width <= 519,
        [`${iotPrefix}--image-uploader__mediumwide`]:
          other.width >= 520 && other.height !== 576,
        [`${iotPrefix}--image-uploader__large`]:
          other.width >= 520 && other.width <= 1055 && other.height >= 576,
        [`${iotPrefix}--image-uploader__largewide`]:
          other.width >= 1056 && other.height >= 576,
        [`${iotPrefix}--image-uploader__url`]: fromURL,
      })}>
      {error ? (
        <InlineNotification
          onCloseButtonClick={handleErrorClose}
          kind="error"
          title={i18n.errorTitle}
          subtitle={error}
        />
      ) : fromURL ? (
        <div className={`${iotPrefix}--image-uploader-url-wrapper`}>
          <TextInput
            id={`${iotPrefix}--image-uploader-url-input`}
            ref={imgRef}
            labelText=""
            placeholder={i18n.urlInput}
          />
          <Button size={buttonSize} onClick={handleUploadByURL}>
            {i18n.uploadByURLButton}
          </Button>
          <Button
            size={buttonSize}
            onClick={handleCancelFromURLClick}
            kind="ghost">
            {i18n.uploadByURLCancel}
          </Button>
        </div>
      ) : (
        <>
          <FileUploaderDropContainer
            size="field"
            labelText=""
            onAddFiles={handleOnChange}
          />
          <div className={`${iotPrefix}--image-uploader-icon`}>
            <Image32 />
          </div>
          <div className={`${iotPrefix}--image-uploader-content`}>
            <h2 className={`${iotPrefix}--image-uploader-drop-label-text`}>
              {i18n.dropContainerLabelText}
            </h2>
            <p className={`${iotPrefix}--image-uploader-drop-description-text`}>
              {i18n.dropContainerDescText}
            </p>
            <Button size={buttonSize} onClick={onBrowseClick} kind="primary">
              {i18n.browseImages}
            </Button>
            <Button
              size={buttonSize}
              onClick={handleFromURLClick}
              kind="tertiary">
              {i18n.insertUrl}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

ImageUploader.propTypes = propTypes;
ImageUploader.defaultProps = defaultProps;
export default ImageUploader;
