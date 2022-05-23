import React, { useRef, useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Tooltip } from 'carbon-components-react';
import { debounce } from 'lodash-es';
import {
  Close16,
  ChevronLeft16 as OpenLeft,
  ChevronRight16 as OpenRight,
} from '@carbon/icons-react';

import { settings } from '../../constants/Settings';
import useHasTextOverflow from '../../hooks/useHasTextOverflow';
import Button from '../Button';

const { iotPrefix } = settings;

const propTypes = {
  /** Whether panel is open or not */
  isOpen: PropTypes.bool,
  /** Whether content area has any padding or not */
  isFullWidth: PropTypes.bool,
  /** Whether panel header is condensed or not */
  isCondensed: PropTypes.bool,
  /** Optional override of behavior of side panel which is to slide in */
  type: PropTypes.oneOf(['inline', 'over']),
  /** Which side the side panel will appear next to content */
  direction: PropTypes.oneOf(['left', 'right']),
  /** Callback for when close button is clicked */
  onToggle: PropTypes.func,
  /** Main Title */
  title: PropTypes.string,
  /** Sub title or description - will go away when content is scrolled */
  subtitle: PropTypes.string,
  /** Action items which will appear as part of header above the content */
  actionItems: PropTypes.arrayOf(
    PropTypes.shape({
      buttonLabel: PropTypes.string,
      buttonIcon: PropTypes.elementType,
      buttonCallback: PropTypes.func,
    })
  ),
  /** Optional test id */
  testId: PropTypes.string,
  /** Callback for when Primary footer button is clicked */
  onPrimaryButtonClick: PropTypes.func,
  /** Callback for when Secondary footer button is clicked */
  onSecondaryButtonClick: PropTypes.func,
  i18n: PropTypes.shape({
    closeIconLabel: PropTypes.string,
    openIconLabel: PropTypes.string,
    primaryButtonLabel: PropTypes.string,
    secondaryButtonLabel: PropTypes.string,
  }),
};

const defaultProps = {
  isOpen: false,
  isFullWidth: false,
  isCondensed: false,
  type: undefined,
  direction: 'right',
  title: null,
  subtitle: null,
  actionItems: null,
  testId: 'side-panel',
  i18n: {
    closeIconLabel: 'Close',
    openIconLabel: 'Open',
    primaryButtonLabel: 'Save',
    secondaryButtonLabel: 'Cancel',
  },
  onToggle: undefined,
  onPrimaryButtonClick: undefined,
  onSecondaryButtonClick: undefined,
};

const baseClass = `${iotPrefix}--sidepanel`;

const SidePanelAlt = ({
  isOpen,
  isFullWidth,
  isCondensed,
  type,
  direction,
  title,
  subtitle,
  actionItems,
  testId,
  i18n,
  onToggle,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  // eslint-disable-next-line react/prop-types
  children,
  // eslint-disable-next-line react/prop-types
  style,
}) => {
  const titleRef = useRef();
  const subtitleRef = useRef();
  const contenteRef = useRef();
  const truncatesTitle = useHasTextOverflow(titleRef, title);
  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);
  const toggleIcon = useMemo(() => {
    return isOpen
      ? { icon: Close16, label: mergedI18n.closeIconLabel, tooltipPostion: 'left' }
      : {
          icon: direction === 'right' ? OpenLeft : OpenRight,
          label: mergedI18n.openIconLabel,
          tooltipPostion: direction === 'left' ? 'right' : 'left',
        };
  }, [isOpen, mergedI18n.closeIconLabel, mergedI18n.openIconLabel, direction]);
  const actionIconBtns = useMemo(
    () =>
      actionItems &&
      actionItems.map((e, i) => (
        <Button
          testId={`${testId}-action-button-${e.buttonLabel}`}
          className={`${baseClass}__action-bar__item-${i + 1}`}
          key={`${e.buttonLabel}-${i}`}
          hasIconOnly
          iconDescription={e.buttonLabel}
          kind="ghost"
          renderIcon={e.buttonIcon}
          onClick={e.buttonCallback}
          size="small"
        />
      )),
    [actionItems, testId]
  );
  // Since subtitle is dynamic we set a css variable with the height value to animate in condensed mode
  const [subtitleHeight, setSubtitleHeight] = useState('100%');
  // Triggerd when the content is scrolled in either direction
  const [isScrolling, setIsScrolling] = useState(false);
  // If content scrollTop is not 0 we set it to isScrolled
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setTimeout(() => setSubtitleHeight(subtitleRef?.current?.getBoundingClientRect().height), 500);
  }, [subtitle]);

  const delayedScrollCheck = debounce(() => {
    if (contenteRef.current.scrollTop !== 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }, 250);

  useEffect(() => {
    delayedScrollCheck();
  }, [delayedScrollCheck, isScrolling]);

  return (
    <div
      key={`sidePanel--${subtitle}`}
      data-testid={testId}
      className={classnames(`${baseClass}`, {
        [`${baseClass}--closed`]: !isOpen,
        [`${baseClass}--full-width`]: isFullWidth,
        [`${baseClass}--start`]: direction === 'left',
        [`${baseClass}--inline`]: type === 'inline',
        [`${baseClass}--slide-over`]: type === 'over',
        [`${baseClass}--condensed`]: isCondensed || isScrolled,
      })}
      style={style}
    >
      {onToggle && (isOpen || type === 'inline') ? (
        <Button
          testId={`${testId}-toggle-button`}
          hasIconOnly
          className={`${baseClass}__toggle-button`}
          kind="ghost"
          iconDescription={toggleIcon.label}
          renderIcon={toggleIcon.icon}
          onClick={onToggle}
          tooltipPosition={toggleIcon.tooltipPostion}
        />
      ) : null}
      <header className={`${baseClass}__header`}>
        {title && truncatesTitle ? (
          <Tooltip
            data-testid={`${testId}-title`}
            ref={titleRef}
            showIcon={false}
            triggerClassName={`${baseClass}__title`}
            triggerText={title}
          >
            {title}
          </Tooltip>
        ) : title ? (
          <h2 data-testid={`${testId}-title`} ref={titleRef} className={`${baseClass}__title`}>
            {title}
          </h2>
        ) : null}
        {subtitle ? (
          <p
            ref={subtitleRef}
            data-testid={`${testId}-subtitle`}
            style={{ '--sub-title-height': subtitleHeight }}
            className={`${baseClass}__subtitle`}
          >
            {subtitle}
          </p>
        ) : null}
        {actionIconBtns ? (
          <div data-testid={`${testId}-action-bar`} className={`${baseClass}__action-bar`}>
            {actionIconBtns}
          </div>
        ) : null}
      </header>
      <section
        data-testid={`${testId}-content`}
        ref={contenteRef}
        className={`${baseClass}__content`}
        onScroll={() => setIsScrolling((prev) => !prev)}
      >
        {children}
      </section>
      {onSecondaryButtonClick || onPrimaryButtonClick ? (
        <div className={`${baseClass}__footer`} data-testid={`${testId}-footer`}>
          {onSecondaryButtonClick ? (
            <Button
              testId={`${testId}-secondary-button`}
              className={`${baseClass}__footer__secondary-button`}
              onClick={onSecondaryButtonClick}
              tooltipPosition={toggleIcon.tooltipPostion}
              kind="secondary"
            >
              {mergedI18n.secondaryButtonLabel}
            </Button>
          ) : undefined}
          {onPrimaryButtonClick ? (
            <Button
              testId={`${testId}-primary-button`}
              className={`${baseClass}__footer__primary-button`}
              kind="primary"
              onClick={onPrimaryButtonClick}
            >
              {mergedI18n.primaryButtonLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

SidePanelAlt.propTypes = propTypes;
SidePanelAlt.defaultProps = defaultProps;
export default SidePanelAlt;
