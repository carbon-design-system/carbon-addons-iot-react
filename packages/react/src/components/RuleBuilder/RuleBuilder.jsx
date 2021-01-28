import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import { ToolbarSVGWrapper } from '../Card/CardToolbar';
import Button from '../Button';

const { iotPrefix } = settings;

const propTypes = {
  className: PropTypes.string,
  /** Text for main tilte of page */
  titleText: PropTypes.string,
  /** Text for metadata for the filter */
  metaText: PropTypes.string,
  /** Unique id for particular filter */
  id: PropTypes.string,
  /**
   * Optional action buttons at top of page and callbacks to handle actions
   */
  actionBar: PropTypes.arrayOf(PropTypes.shape({
    actionId: PropTypes.string.isRequired,
    actionLabel: PropTypes.string.isRequired,
    actionIcon: PropTypes.elementType.isRequired,
    actionCallback: PropTypes.func.isRequired,
  })),
  saveLabel: PropTypes.string,
  handleOnSave: PropTypes.func.isRequired,
  cancelLabel: PropTypes.string,
  handleOnCancel: PropTypes.func.isRequired,
  /**
   * Optional footer buttons and callbacks to handle actions
   */
  footerButtons: PropTypes.arrayOf(PropTypes.shape({
    buttonId: PropTypes.string.isRequired,
    buttonLabel: PropTypes.string.isRequired,
    buttonCallback: PropTypes.func.isRequired,
  })),
  // filterTabText: PropTypes.string,
  // sharingTabText: PropTypes.string,
  // onChange: PropTypes.func,
}

const defaultProps = {
  className: null,
  titleText: 'Undefined',
  metaText: null,
  id: null,
  saveLabel: 'Save',
  cancelLabel: 'Cancel',
  actionBar: null,
  footerButtons: null,
  // filterTabText: 'Filter builder',
  // sharingTabText: 'Sharing and preferences',
  // onChange: () => {},
};

const baseClass = `${iotPrefix}--rule-builder`;

export const ACTIONTYPES = {
  FAVORITE: 'FAVORITE',
  SHARE: 'SHARE',
  DELTE: 'DELETE',
  SAVE: 'SAVE',
}

const RuleBuilder = ({
  className,
  titleText,
  metaText,
  id,
  saveLabel,
  handleOnSave,
  cancelLabel,
  handleOnCancel,
  actionBar,
  footerButtons,
  // filterTabText,
  // sharingTabText,
  // onChange,
  // children,
}) => {
  const actions = useMemo(() => actionBar?.map((i)=> (
    <ToolbarSVGWrapper
      key={i.actionId}
      data-testid={i.actionId}
      title={i.actionLabel}
      onClick={i.actionCallback}
      iconDescription={i.actionLabel}
      renderIcon={i.actionIcon}
    />
  )), [actionBar])
  const footer = useMemo(() => footerButtons?.map((i) => (
    <Button data-testid={i.buttonId} key={i.buttonId} kind="secondary" className={`${baseClass}--footer-actions-preview`} onClick={i.buttonCallback} >{i.buttonLabel}</Button>
  )), [footerButtons]);

  return (
    <section className={classnames(baseClass, className)} id={id} data-testid={id || 'rule-builder'}>
      <header className={`${baseClass}--header`}>
        <div>
          <h1 className={`${baseClass}--header-title`}>{titleText}</h1>
          {metaText && (<p className={`${baseClass}--header-metatext`}>{metaText}</p>)}
        </div>
        <div className={`${baseClass}--header-actions`}>
          {actions}
          <Button className={`${baseClass}--header-actions-save`} data-testid="rule-builder-save" onClick={handleOnSave} size="small">{saveLabel}</Button>
        </div>
      </header>
      <div className={`${baseClass}--body`}>
        Hello
      </div>
      <footer className={`${baseClass}--footer`}>
        <Button kind="secondary" className={`${baseClass}--footer-actions-cancel`} data-testid="rule-builder-cancel" onClick={handleOnCancel} >{cancelLabel}</Button>
        {footer}
      </footer>
    </section>
  )
}

RuleBuilder.propTypes = propTypes;
RuleBuilder.defaultProps = defaultProps;

export default RuleBuilder;