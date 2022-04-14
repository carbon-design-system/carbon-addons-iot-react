import React from 'react';
import PropTypes from 'prop-types';
import {
  Close16,
  ChevronLeft16,
  ChevronRight16,
  OpenPanelLeft16,
  OpenPanelRight16,
} from '@carbon/icons-react';
import classNames from 'classnames';

import Button from '../Button';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  direction: PropTypes.string,
  open: PropTypes.bool,
  slideOver: PropTypes.bool,
  inline: PropTypes.bool,
  slideIn: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  showDrawer: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.node,
  onClose: PropTypes.func,
  primaryButton: PropTypes.node,
  secondaryButton: PropTypes.node,
  icons: PropTypes.arrayOf(PropTypes.node),
  testId: PropTypes.string,
};
const defaultProps = {
  direction: 'end',
  open: false,
  slideOver: false,
  inline: false,
  slideIn: false,
  showCloseButton: false,
  showDrawer: false,
  title: '',
  content: '',
  onClose: () => {},
  primaryButton: null,
  secondaryButton: null,
  testId: undefined,
  icons: undefined,
};

const SidePanel = ({
  open,
  title,
  slideOver,
  inline,
  slideIn,
  content,
  showCloseButton,
  showDrawer,
  onClose,
  primaryButton,
  secondaryButton,
  direction = 'end',
  icons,
  testId,
}) => {
  const getIcon = () => {
    let icon;
    if (slideOver && showCloseButton) {
      icon = Close16;
    }

    if (inline && direction === 'start') {
      icon = open ? ChevronLeft16 : OpenPanelLeft16;
    }

    if (inline && direction === 'end') {
      icon = open ? ChevronRight16 : OpenPanelRight16;
    }

    return icon;
  };

  return (
    <div
      data-testid={testId}
      className={classNames(`${iotPrefix}--side-panel`, {
        [`${iotPrefix}--side-panel--drawer`]: !open,
        [`${iotPrefix}--side-panel--inline`]: inline,
        [`${iotPrefix}--side-panel--slide-over`]: slideOver,
        [`${iotPrefix}--side-panel--slide-in`]: slideIn,
        active: open,
      })}
    >
      <div className={`panel ${iotPrefix}--side-panel--${direction}`}>
        {(slideOver && showCloseButton) || (inline && showDrawer) ? (
          <Button
            testId="close-button"
            hasIconOnly
            className={`${iotPrefix}--side-panel--close-button`}
            kind="ghost"
            renderIcon={getIcon()}
            onClick={onClose}
          />
        ) : null}

        <div className="panel-content-wrapper">
          <div
            data-testid="side-panel-title"
            className={`${iotPrefix}--side-panel--title ${iotPrefix}--side-panel--title--with-close`}
          >
            {title}
          </div>
          {icons && (
            <div data-testid="side-panel-action-bar" className="iot--side-panel--action-bar">
              {icons}
            </div>
          )}
          <div data-testid="side-panel-content" className={`${iotPrefix}-side-panel--content`}>
            {content}
          </div>
          {open ? (
            <div data-testid="side-panel-footer" className={`${iotPrefix}--side-panel--footer`}>
              {secondaryButton}
              {primaryButton}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

SidePanel.propTypes = propTypes;
SidePanel.defaultProps = defaultProps;

export default SidePanel;
