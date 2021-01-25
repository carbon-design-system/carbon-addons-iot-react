import React from 'react';
import PropTypes from 'prop-types';
import { Star16, Share16, TrashCan16 } from '@carbon/icons-react';
import classnames from 'classnames';
import uniqueId from 'lodash/uniqueId'

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
   * Buttons at top of page and callback to handle actions
   */
  favoriteId: PropTypes.string,
  favoriteLabel: PropTypes.string,
  shareId: PropTypes.string,
  shareLabel: PropTypes.string,
  deleteId: PropTypes.string,
  deleteLabel: PropTypes.string,
  saveId: PropTypes.string,
  saveLabel: PropTypes.string,
  /**
  * callback that is called with the action type and filter id
  * handleAction(SHARE, id);
  */
  handleAction: PropTypes.func,
  cancelText: PropTypes.string,
  handleOnCancel: PropTypes.func,
  previewText: PropTypes.string,
  handleOnPreview: PropTypes.func,
  applyText: PropTypes.string,
  handleOnApply: PropTypes.func,
  // filterTabText: PropTypes.string,
  // sharingTabText: PropTypes.string,
  // onChange: PropTypes.func,
}

const defaultProps = {
  className: null,
  titleText: 'Undefined',
  metaText: null,
  id: uniqueId('rule-builder-'),
  favoriteId: null,
  favoriteLabel: 'Favorite',
  shareId: null,
  shareLabel: 'Share',
  deleteId: null,
  deleteLabel: 'Delete',
  saveId: null,
  saveLabel: 'Save',
  handleAction: () => {},
  cancelText: 'Cancel',
  handleOnCancel: () => {},
  previewText: 'Preview results',
  handleOnPreview: () => {},
  applyText: 'Apply filter',
  handleOnApply: () => {},
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
  favoriteId,
  favoriteLabel,
  shareId,
  shareLabel,
  deleteId,
  deleteLabel,
  saveId,
  saveLabel,
  handleAction,
  cancelText,
  handleOnCancel,
  previewText,
  handleOnPreview,
  applyText,
  handleOnApply,
  // footer,
  // filterTabText,
  // sharingTabText,
  // onChange,
  // children,
}) => {

  return (
    <section className={classnames(baseClass, className)} id={id} data-testid='rule-builder'>
      <header className={`${baseClass}--header`}>
        <div>
          <h1 className={`${baseClass}--header-title`}>{titleText}</h1>
          {metaText && (<p className={`${baseClass}--header-metatext`}>{metaText}</p>)}
        </div>
        <div className={`${baseClass}--header-actions`}>
          <ToolbarSVGWrapper
            id={favoriteId}
            title={favoriteLabel}
            onClick={() => handleAction(ACTIONTYPES.FAVORITE)}
            iconDescription={favoriteLabel}
            renderIcon={Star16}
          />
          <ToolbarSVGWrapper
            id={shareId}
            title={shareLabel}
            onClick={() => handleAction(ACTIONTYPES.SHARE)}
            iconDescription={shareLabel}
            renderIcon={Share16}
          />
          <ToolbarSVGWrapper
            id={deleteId}
            title={deleteLabel}
            onClick={() => handleAction(ACTIONTYPES.DELETE)}
            iconDescription={deleteLabel}
            renderIcon={TrashCan16}
          />
          <Button className={`${baseClass}--header-actions-save`} id={saveId} onClick={() => handleAction(ACTIONTYPES.SAVE)} size="small">{saveLabel}</Button>
        </div>
      </header>
      <div className={`${baseClass}--body`}>
        Hello
      </div>
      <footer className={`${baseClass}--footer`}>
        <Button kind="secondary" className={`${baseClass}--footer-actions-cancel`} onClick={handleOnCancel} >{cancelText}</Button>
        <Button kind="secondary" className={`${baseClass}--footer-actions-preview`} onClick={handleOnPreview} >{previewText}</Button>
        <Button kind="secondary" className={`${baseClass}--footer-actions-apply`} onClick={handleOnApply} >{applyText}</Button>
      </footer>
    </section>
  )
}

RuleBuilder.propTypes = propTypes;
RuleBuilder.defaultProps = defaultProps;

export default RuleBuilder;