import React, { useRef, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  CodeSnippetSkeleton,
  InlineNotification,
  CopyButton,
  Button,
} from 'carbon-components-react';
import { Popup16 } from '@carbon/icons-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import ComposedModal from '../ComposedModal';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  ...ComposedModal.propTypes,
  /*
   * On submit callback. It's called with editor value, and a callback to set an error messages
   * onSumbit(value, setError)
   */
  onSubmit: PropTypes.func.isRequired,
  /** Callback called when modal close icon or cancel button is pressed */
  onClose: PropTypes.func.isRequired,
  /** Callback called when modal close icon or cancel button is pressed */
  onCopy: PropTypes.func,
  /** All the labels that need translation */
  i18n: PropTypes.shape({
    errorTitle: PropTypes.string,
    modalTitle: PropTypes.string,
    modalLabel: PropTypes.string,
    modalHelpText: PropTypes.string,
    modalIconDescription: PropTypes.string,
    copyBtnDescription: PropTypes.string,
    copyBtnFeedBack: PropTypes.string,
  }),
  /** the language being written in the editor */
  language: PropTypes.string,
  /** Initial value for the editor */
  initialValue: PropTypes.string,
};

const defaultProps = {
  i18n: {
    errorTitle: 'Error:',
    modalTitle: 'Edit the JSONs',
    modalLabel: 'JSON Editor',
    modalHelpText: null,
    modalIconDescription: 'Close',
  },
  language: 'json',
  initialValue: null,
  onCopy: null,
};

const CardCodeEditor = ({
  onSubmit,
  onClose,
  onCopy,
  i18n,
  language,
  initialValue,
  ...composedModalProps
}) => {
  const editorValue = useRef();
  const [isExpanded, setIsExpanded] = useState();
  const [error, setError] = useState(false);

  useEffect(
    () => {
      // eslint-disable-next-line no-unused-expressions
      editorValue?.current?.layout();
    },
    [isExpanded]
  );

  /**
   *
   * @param {func} _editorValue - a method that returns the current value of the editor
   * @param {object} val - instance of the monaco editor
   */
  const handleEditorDidMount = (_editorValue, val) => {
    editorValue.current = val;
  };

  const handleOnSubmit = () => {
    onSubmit(editorValue.current.getValue(), setError);
  };

  const handleOnExpand = () => {
    setIsExpanded(expandedState => !expandedState);
  };

  const handleOnCopy = () => {
    return onCopy && onCopy(editorValue.current.getValue());
  };

  return (
    <ComposedModal
      className={classnames(`${iotPrefix}--editor`, {
        [`${iotPrefix}--editor__expanded`]: isExpanded,
      })}
      isLarge
      header={{
        label: i18n.modalLabel,
        title: i18n.modalTitle,
        helpText: i18n.modalHelpText || null,
      }}
      onSubmit={handleOnSubmit}
      onClose={onClose}
      iconDescription={i18n.modalIconDescription}
      {...composedModalProps}
    >
      <Button
        className={`${iotPrefix}--editor-expand`}
        hasIconOnly
        renderIcon={Popup16}
        iconDescription="Expand"
        onClick={handleOnExpand}
        kind="ghost"
      />
      {error && (
        <InlineNotification
          className={`${iotPrefix}--editor-notification`}
          kind="error"
          onCloseButtonClick={() => setError(false)}
          title={i18n.errorTitle}
          subtitle={error}
        />
      )}
      <div className={`${iotPrefix}--editor-copy-wrapper`}>
        {onCopy && (
          <CopyButton
            className={`${iotPrefix}--editor-copy`}
            onClick={handleOnCopy}
            iconDescription={i18n.copyBtnDescription}
            feedback={i18n.copyBtnFeedBack}
          />
        )}
        <Editor
          className={`${iotPrefix}--editor-container`}
          wrapperClassName={`${iotPrefix}--editor-wrapper`}
          loading={<CodeSnippetSkeleton />}
          value={initialValue}
          line={2}
          language={language}
          editorDidMount={handleEditorDidMount}
          options={{
            minimap: {
              enabled: false,
            },
            autoIndent: true,
            wordWrap: isExpanded ? 'off' : 'bounded',
          }}
        />
      </div>
    </ComposedModal>
  );
};

CardCodeEditor.propTypes = propTypes;
CardCodeEditor.defaultProps = defaultProps;
export default CardCodeEditor;
