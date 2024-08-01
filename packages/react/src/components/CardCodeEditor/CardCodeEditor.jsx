import React, { useRef, useState, useEffect, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { CodeSnippetSkeleton, InlineNotification, CopyButton } from '@carbon/react';
import { Popup } from '@carbon/react/icons';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import ComposedModal from '../ComposedModal';
import { settings } from '../../constants/Settings';
import Button from '../Button';
import deprecate from '../../internal/deprecate';

const { iotPrefix } = settings;

const propTypes = {
  ...ComposedModal.propTypes, // eslint-disable-line react/forbid-foreign-prop-types
  /*
   * On submit callback. It's called with editor value, and a callback to set an error messages
   * onSubmit(value, setError)
   */
  onSubmit: PropTypes.func.isRequired,
  /** Callback called when modal close icon or cancel button is pressed */
  onClose: PropTypes.func.isRequired,
  /** Callback called when editor copy icon is pressed */
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
    expandBtnLabel: PropTypes.string,
    modalPrimaryButtonLabel: PropTypes.string,
    modalSecondaryButtonLabel: PropTypes.string,
  }),
  /** the language being written in the editor */
  language: PropTypes.string,
  /** Initial value for the editor */
  initialValue: PropTypes.string,
  // TODO: remove deprecated testID in v3.
  // eslint-disable-next-line react/require-default-props
  testID: deprecate(
    PropTypes.string,
    `The 'testID' prop has been deprecated. Please use 'testId' instead.`
  ),
  testId: PropTypes.string,
};

const defaultProps = {
  i18n: {
    errorTitle: 'Error:',
    modalTitle: 'Edit the JSONs',
    modalLabel: 'JSON Editor',
    modalHelpText: null,
    modalIconDescription: 'Close',
    expandBtnLabel: 'Expand',
    modalPrimaryButtonLabel: 'Save',
    modalSecondaryButtonLabel: 'Cancel',
  },
  language: 'json',
  initialValue: null,
  onCopy: null,
  testId: 'card-code-editor',
};

const CardCodeEditor = ({
  onSubmit,
  onClose,
  onCopy,
  i18n,
  language,
  initialValue,
  // TODO: remove deprecated testID in v3.
  testID,
  testId,
  ...composedModalProps
}) => {
  const editorValue = useRef();
  const [isExpanded, setIsExpanded] = useState();
  const [error, setError] = useState(false);

  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    editorValue?.current?.layout();
  }, [isExpanded]);

  /**
   *
   * @param {object} editor - instance of the editor
   * @param {object} _monaco - instance of monaco
   */
  // eslint-disable-next-line no-unused-vars
  const handleEditorDidMount = (editor, _monaco) => {
    editorValue.current = editor;
  };

  const handleOnSubmit = () => {
    onSubmit(editorValue?.current?.getValue(), setError);
  };

  const handleOnExpand = () => {
    setIsExpanded((expandedState) => !expandedState);
  };

  const handleOnCopy = () => {
    const value = editorValue?.current?.getValue() || initialValue;
    return onCopy && onCopy(value);
  };

  return (
    <ComposedModal
      // TODO: remove deprecated testID in v3 and pass testId to override defaults
      // testID={`${testID || testId}-modal`}
      className={classnames(`${iotPrefix}--editor`, {
        [`${iotPrefix}--editor__expanded`]: isExpanded,
      })}
      isLarge
      header={{
        label: mergedI18n.modalLabel,
        title: mergedI18n.modalTitle,
        helpText: mergedI18n.modalHelpText || null,
      }}
      onSubmit={handleOnSubmit}
      onClose={onClose}
      iconDescription={mergedI18n.modalIconDescription}
      footer={{
        primaryButtonLabel: mergedI18n.modalPrimaryButtonLabel,
        secondaryButtonLabel: mergedI18n.modalSecondaryButtonLabel,
      }}
      {...composedModalProps}
    >
      <Button
        className={`${iotPrefix}--editor-expand`}
        hasIconOnly
        renderIcon={Popup}
        iconDescription={mergedI18n.expandBtnLabel}
        onClick={handleOnExpand}
        kind="ghost"
        // TODO: remove deprecated testID in v3.
        testId={`${testID || testId}-expand-button`}
      />
      {error && (
        <InlineNotification
          className={`${iotPrefix}--editor-notification`}
          kind="error"
          onCloseButtonClick={() => setError(false)}
          title={mergedI18n.errorTitle}
          subtitle={error}
          // TODO: remove deprecated testID in v3.
          data-testid={`${testID || testId}-notification`}
        />
      )}
      <div
        // TODO: remove deprecated testID in v3.
        data-testid={testID || testId}
        className={`${iotPrefix}--editor-copy-wrapper`}
      >
        {onCopy && (
          <CopyButton
            className={`${iotPrefix}--editor-copy`}
            onClick={handleOnCopy}
            iconDescription={mergedI18n.copyBtnDescription}
            feedback={mergedI18n.copyBtnFeedBack}
            // TODO: remove deprecated testID in v3.
            data-testid={`${testID || testId}-copy-button`}
          />
        )}
        <Editor
          className={`${iotPrefix}--editor-container`}
          wrapperClassName={`${iotPrefix}--editor-wrapper`}
          loading={<CodeSnippetSkeleton />}
          value={initialValue}
          line={2}
          language={language}
          onMount={handleEditorDidMount}
          options={{
            minimap: {
              enabled: false,
            },
            autoIndent: true,
            wordWrap: 'off',
          }}
        />
      </div>
    </ComposedModal>
  );
};

CardCodeEditor.propTypes = propTypes;
CardCodeEditor.defaultProps = defaultProps;
export default CardCodeEditor;
