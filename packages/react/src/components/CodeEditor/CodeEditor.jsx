import React, { useRef, useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { CodeSnippetSkeleton, CopyButton, Button } from 'carbon-components-react';
import PropTypes from 'prop-types';
import { Upload16 } from '@carbon/icons-react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';

const { prefix: carbonPrefix, iotPrefix } = settings;

const propTypes = {
  /** Initial value for the editor */
  initialValue: PropTypes.string,
  /** the language being written in the editor */
  language: PropTypes.string,
  /** Callback called when editor copy icon is pressed */
  onCopy: PropTypes.func,
  /** List of types that the upload input accept */
  accept: PropTypes.arrayOf(PropTypes.string),
  /** Light theme */
  light: PropTypes.bool,
  /** Boolean to define if upload button should be render or not */
  hasUpload: PropTypes.bool,
  /** Callback for file load errors */
  onUploadError: PropTypes.func,
  /** Callback on code editor change */
  onCodeEditorChange: PropTypes.func,
  /** All the labels that need translation */
  i18n: PropTypes.shape({
    copyBtnDescription: PropTypes.string,
    copyBtnFeedBack: PropTypes.string,
    uploadBtnDescription: PropTypes.string,
  }),
  testId: PropTypes.string,
};

const defaultProps = {
  initialValue: null,
  language: 'css',
  onCopy: null,
  accept: ['.css'],
  light: false,
  hasUpload: false,
  onUploadError: null,
  onCodeEditorChange: null,
  i18n: {
    copyBtnDescription: 'Copy content',
    copyBtnFeedBack: 'Copied',
    uploadBtnDescription: 'Upload your file',
  },
  testId: 'code-editor',
};
const CodeEditor = ({
  initialValue,
  language,
  onCopy,
  accept,
  hasUpload,
  onUploadError,
  onCodeEditorChange,
  light,
  i18n,
  testId,
}) => {
  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);

  const editorValue = useRef();
  const inputNode = useRef(null);

  const [codeEditorValue, setCodeEditorValue] = useState(initialValue);

  /**
   *
   * @param {func} _editorValue - a method that returns the current value of the editor
   * @param {object} val - instance of the monaco editor
   */
  const handleEditorDidMount = (_editorValue, val) => {
    editorValue.current = val;
  };

  /**
   * Function used in editor onChange
   * @param {*} editorVal editor value
   */
  const handleEditorChange = (editorVal) => {
    setCodeEditorValue(editorVal);
    if (onCodeEditorChange) {
      onCodeEditorChange(editorVal);
    }
  };

  /**
   * Handle copy button click
   * @returns current editor value
   */
  const handleOnCopy = () => onCopy && onCopy(codeEditorValue);

  /**
   * takes a array of File javascript objects https://developer.mozilla.org/en-US/docs/Web/API/File
   * and creates a FileReader and  actually calls the readAsText method to trigger the loading of the file.
   */
  const readFileContent = (files) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      setCodeEditorValue(event.target.result);
      if (onCodeEditorChange) {
        onCodeEditorChange(event.target.result);
      }
    };
    fileReader.onerror = (event) => onUploadError(event);
    fileReader.readAsText(files[0]);
  };

  const handleOnChange = (event) => {
    event.stopPropagation();
    readFileContent(event.target.files);
  };

  return (
    <div data-testid={testId} className={`${iotPrefix}--code-editor-wrapper`}>
      {hasUpload ? (
        <>
          <Button
            className={classnames(`${iotPrefix}--code-editor-upload`, {
              [`${iotPrefix}--code-editor-upload--light`]: light,
            })}
            hasIconOnly
            iconDescription={mergedI18n.uploadBtnDescription}
            onClick={() => {
              if (inputNode.current) {
                inputNode.current.value = '';
                inputNode.current.click();
              }
            }}
            renderIcon={Upload16}
            kind="ghost"
            size="field"
            data-testid={`${testId}-upload-button`}
          />
          <input
            className={`${carbonPrefix}--visually-hidden`}
            ref={inputNode}
            id="upload"
            disabled={false}
            type="file"
            tabIndex={-1}
            multiple={false}
            accept={accept}
            name="upload"
            onChange={handleOnChange}
          />
        </>
      ) : null}
      {onCopy && (
        <CopyButton
          className={classnames(`${iotPrefix}--code-editor-copy`, {
            [`${iotPrefix}--code-editor-copy--light`]: light,
          })}
          onClick={handleOnCopy}
          iconDescription={mergedI18n.copyBtnDescription}
          feedback={mergedI18n.copyBtnFeedBack}
          data-testid={`${testId}-copy-button`}
        />
      )}
      <Editor
        className={classnames(`${iotPrefix}--code-editor-container`, {
          [`${iotPrefix}--code-editor-container--light`]: light,
        })}
        wrapperClassName={`${iotPrefix}--code-editor-wrapper`}
        loading={<CodeSnippetSkeleton />}
        value={codeEditorValue}
        line={2}
        language={language}
        editorDidMount={handleEditorDidMount}
        onChange={handleEditorChange}
        options={{
          minimap: {
            enabled: false,
          },
          autoIndent: true,
          wordWrap: 'off',
        }}
      />
    </div>
  );
};
CodeEditor.propTypes = propTypes;
CodeEditor.defaultProps = defaultProps;
export default CodeEditor;
