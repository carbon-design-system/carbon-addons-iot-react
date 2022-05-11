import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Close16,
  ChevronLeft16 as OpenLeft,
  ChevronRight16 as OpenRight,
} from '@carbon/icons-react';
import classNames from 'classnames';

import Button from '../Button';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  /** silde in from start or end direction */
  direction: PropTypes.string,
  /** side panel is expanded  or collapsed */
  open: PropTypes.bool,
  /** slide overlay */
  slideOver: PropTypes.bool,
  /** inline side panel with optional drawer */
  inline: PropTypes.bool,
  /** show close button in side panel */
  showCloseButton: PropTypes.bool,
  /** show rail for inline panel */
  isRail: PropTypes.bool,
  /** title to show in the side panel */
  title: PropTypes.string,
  /** Optional element that is hidden when the header is a sticky scroll */
  subtitle: PropTypes.string,
  /** content to show in the side panel */
  children: PropTypes.node,
  /** call back function for close button */
  onClose: PropTypes.func,
  /** footer primary button */
  primaryButton: PropTypes.node,
  /** footer secondary button */
  secondaryButton: PropTypes.node,
  /** icons in action bar */
  icons: PropTypes.arrayOf(PropTypes.node),
  testId: PropTypes.string,
  /** condensed style */
  condensed: PropTypes.bool,
};
const defaultProps = {
  direction: 'start',
  open: false,
  slideOver: false,
  inline: false,
  showCloseButton: false,
  isRail: false,
  title: '',
  subtitle: undefined,
  children: null,
  primaryButton: undefined,
  secondaryButton: undefined,
  testId: 'side-panel',
  icons: undefined,
  condensed: false,
  onClose: undefined,
};

const SidePanel = ({
  open,
  title,
  subtitle,
  slideOver,
  inline,
  showCloseButton,
  isRail,
  onClose,
  primaryButton,
  secondaryButton,
  direction,
  icons,
  testId,
  condensed,
  children,
}) => {
  const getIcon = useMemo(
    () =>
      open && ((slideOver && showCloseButton) || inline)
        ? Close16
        : !open && inline && direction === 'start'
        ? OpenRight
        : OpenLeft,
    [direction, inline, open, showCloseButton, slideOver]
  );

  return (
    <div
      data-testid={testId}
      className={classNames(`${iotPrefix}--side-panel`, {
        [`${iotPrefix}--side-panel__with-footer`]: primaryButton || secondaryButton,
        [`${iotPrefix}--side-panel--inline`]: inline,
        [`${iotPrefix}--side-panel__drawer`]: isRail && !open,
        [`${iotPrefix}--side-panel--slide-over`]: slideOver,
        [`${iotPrefix}--side-panel--slide-in`]: !inline && !slideOver,
        [`${iotPrefix}--side-panel--active`]: open,
      })}
    >
      <div className={`${iotPrefix}--side-panel__panel ${iotPrefix}--side-panel--${direction}`}>
        {(slideOver && showCloseButton && onClose) || (inline && isRail) ? (
          <Button
            testId="close-button"
            hasIconOnly
            className={`${iotPrefix}--side-panel__close-button`}
            kind="ghost"
            renderIcon={getIcon}
            onClick={onClose}
          />
        ) : null}

        <div className={`${iotPrefix}--side-panel__content-wrapper`}>
          <div
            data-testid="side-panel-header"
            className={classNames(`${iotPrefix}--side-panel__header`, {
              // [`${iotPrefix}--side-panel__header--with-close`]: showCloseButton,
            })}
          >
            <div
              data-testid="side-panel-title"
              className={classNames(
                `${iotPrefix}--side-panel__title`,
                { [`${iotPrefix}--side-panel__title--with-close`]: showCloseButton },
                { [`${iotPrefix}--side-panel__title--condensed`]: condensed }
              )}
            >
              {title}
            </div>
            {subtitle ? (
              <div
                data-testid="side-panel-subtitle"
                className={`${iotPrefix}--side-panel__subtitle`}
              >
                {subtitle}
              </div>
            ) : null}
            {icons && (
              <div
                data-testid="side-panel-action-bar"
                className={`${iotPrefix}--side-panel__action-bar`}
              >
                {icons}
              </div>
            )}
          </div>

          <div data-testid="side-panel-content" className={`${iotPrefix}-side-panel__content`}>
            {children}
          </div>
          {open || inline ? (
            <div data-testid="side-panel-footer" className={`${iotPrefix}--side-panel__footer`}>
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
