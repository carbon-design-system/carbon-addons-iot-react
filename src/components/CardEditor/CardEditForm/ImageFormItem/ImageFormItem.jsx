import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../../../constants/Settings';
import { FileUploaderDropContainer, FileUploaderItem } from '../../../../index';

const { iotPrefix } = settings;

const defaultProps = {
  value: undefined,
  supportedTypes: ['.jpg', '.gif', '.png'],
  maxSizeBytes: Number.MAX_VALUE,
  i18n: {
    title: 'Upload image',
    description: 'Max file size is 5 MB.  Supported file types are .jpg, .png, and .gif',
    uploadContainerText: 'Drag a file here or click to upload',
    errorSize: size => `Image too large: ${size}`,
  },
};

const propTypes = {
  /* value of image input (File object) */
  value: PropTypes.shape({}),
  /* extensions supported for upload */
  supportedTypes: PropTypes.arrayOf(PropTypes.string),
  /* maximum file upload size */
  maxSizeBytes: PropTypes.number,
  /* callback when image input value changes (File object) */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({}),
};

const ImageFormItem = ({ value, supportedTypes, maxSizeBytes, onChange, i18n }) => {
  const [imageFileName, setImageFileName] = useState(value);
  const [error, setError] = useState();

  const mergedI18N = { ...defaultProps.i18n, ...i18n };

  const uploaderContent = imageFileName ? (
    <FileUploaderItem
      name={imageFileName}
      invalid={error}
      errorSubject={error}
      status="edit"
      onDelete={() => {
        setImageFileName(null);
        onChange(null);
      }}
    />
  ) : (
    <FileUploaderDropContainer
      accept={supportedTypes}
      id="fileUploader"
      labelText={mergedI18N.uploadContainerText}
      name="fileUploader"
      onAddFiles={(evt, { addedFiles }) => {
        const addedFile = addedFiles[0];
        if (addedFile.size > maxSizeBytes) {
          setError(mergedI18N.errorSize(addedFile.size));
          setImageFileName(addedFile.name);
        } else {
          setImageFileName(addedFile.name);
          onChange(addedFile);
        }
      }}
    />
  );
  return (
    <div className={`${iotPrefix}--image-form-item`}>
      <h6>{mergedI18N.title}</h6>
      <div className={`${iotPrefix}--image-form-item--description`}>{mergedI18N.description}</div>
      {uploaderContent}
    </div>
  );
};

ImageFormItem.defaultProps = defaultProps;
ImageFormItem.propTypes = propTypes;

export default ImageFormItem;
