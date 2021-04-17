import PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import classnames from 'classnames';
import { Information20, Edit20 } from '@carbon/icons-react';
import { Breadcrumb, BreadcrumbItem, Tooltip, SkeletonText, Tabs } from 'carbon-components-react';
import throttle from 'lodash/throttle';

import deprecate from '../../internal/deprecate';
import Button from '../Button';

const HEADER_MODES = {
  STATIC: 'STATIC',
  STICKY: 'STICKY',
  DYNAMIC: 'DYNAMIC',
  CONDENSED: 'CONDENSED',
};

const PageTitleBarPropTypes = {
  /** Title of the page  */
  title: PropTypes.node.isRequired,
  /** Details about what the page shows */
  description: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  /** How the header should react to scrolling */
  headerMode: PropTypes.oneOf(Object.values(HEADER_MODES)),
  /** offset for the 'top' attribute on the sticky header. Number will be converted to px */
  stickyHeaderOffset: PropTypes.number,

  /** Optional node to render in the right side of the PageTitleBar
   *  NOTE: Deprecated in favor of extraContent
   */
  rightContent: deprecate(
    PropTypes.node,
    '\nThe prop `rightContent` for PageTitleBar has been deprecated in favor of `extraContent`'
  ),
  /** Optional node to render to the side of the PageTitleBar */
  extraContent: PropTypes.node,
  /** Optional node to render actions/text above the main actions area */
  upperActions: PropTypes.node,
  /** Breadcrumbs to show */
  breadcrumb: PropTypes.arrayOf(PropTypes.node),
  /** Should page description be collapsed into tooltip. Should be `true` when using in conjunction with tabs. */
  collapsed: PropTypes.bool,
  /** Is the title editable, will display edit icon with callback */
  editable: PropTypes.bool,
  /** Is the page actively loading */
  isLoading: PropTypes.bool,
  onEdit: PropTypes.func,
  i18n: PropTypes.shape({ editIconDescription: PropTypes.string }),
  className: PropTypes.string,
  /** Tabs should be a Tabs component */
  tabs: deprecate(
    PropTypes.oneOfType([
      PropTypes.shape({
        type: PropTypes.oneOf([Tabs]),
      }),
    ]),
    '\nThe prop `tabs` for PageTitleBar has been deprecated in favor of `content`'
  ),
  /** Content rendered beneath title bar */
  content: PropTypes.node,
};

const defaultProps = {
  description: null,
  className: null,
  rightContent: undefined,
  extraContent: undefined,
  upperActions: undefined,
  breadcrumb: null,
  collapsed: false,
  editable: false,
  onEdit: null,
  i18n: {
    editIconDescription: 'Edit page title',
    tooltipIconDescription: 'More information',
  },
  isLoading: false,
  tabs: undefined,
  content: undefined,
  headerMode: HEADER_MODES.STATIC,
  stickyHeaderOffset: 0, // default to 3rem to stick to the bottom of the suite header
};

const PageTitleBar = ({
  title,
  description,
  className,
  rightContent,
  extraContent,
  upperActions,
  breadcrumb,
  collapsed,
  headerMode,
  stickyHeaderOffset: stickyHeaderOffsetProp,
  editable,
  isLoading,
  i18n: { editIconDescription, tooltipIconDescription },
  onEdit,
  tabs,
  content,
}) => {
  const titleBarContent = content || tabs;

  const [condensed, setCondensed] = useState(headerMode === HEADER_MODES.CONDENSED);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [contentActive, setContentActive] = useState(false);

  const breadcrumbRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);

  const stickyHeaderOffset = `${stickyHeaderOffsetProp}px`; // convert to px for styling

  useEffect(() => {
    // if we have scrolled passed the offset, we should be in condensed state
    const handleScroll = throttle(() => {
      let isCondensed;
      let percentComplete;

      if (breadcrumbRef.current && titleRef.current) {
        const breadcrumbDims = breadcrumbRef.current.getBoundingClientRect();
        const titleDims = titleRef.current.getBoundingClientRect();

        if (titleDims.top < breadcrumbDims.bottom) {
          isCondensed = true;
          const distanceLeftToGo = breadcrumbDims.top - titleDims.top;
          const total = breadcrumbDims.height;
          percentComplete = (total - Math.abs(distanceLeftToGo)) / total;

          if (percentComplete < 0.05) {
            percentComplete = 0;
          }

          if (titleDims.top <= breadcrumbDims.top) {
            percentComplete = 1;
          }
        } else {
          isCondensed = false;
          percentComplete = 0;
        }
        setCondensed(isCondensed);
        setTransitionProgress(percentComplete);
      }

      setContentActive(
        contentRef.current &&
          contentRef.current.getBoundingClientRect().top <= stickyHeaderOffsetProp
      );
    }, 50);

    if (headerMode === HEADER_MODES.DYNAMIC) {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerMode, stickyHeaderOffsetProp]);

  const titleActions = useMemo(
    () => (
      <>
        {description && collapsed ? (
          <Tooltip
            tabIndex={0}
            triggerText=""
            triggerId="tooltip"
            tooltipId="tooltip"
            renderIcon={Information20}
            iconDescription={tooltipIconDescription}
          >
            {typeof description === 'string' ? <p>{description}</p> : description}
          </Tooltip>
        ) : null}
        {editable ? (
          <Button
            className="page-title-bar-title--edit"
            kind="ghost"
            size="field"
            hasIconOnly
            renderIcon={Edit20}
            iconDescription={editIconDescription}
            tooltipAlignment="center"
            tooltipPosition="bottom"
            onClick={onEdit}
          />
        ) : null}
      </>
    ),
    [collapsed, description, editIconDescription, editable, onEdit, tooltipIconDescription]
  );

  /* We needs the tabs to render outside the header so the tab stickiness will push away the header stickiness naturally with the scroll */
  // We also want sticky mode to render outside so we can sticky the entire header element
  const hasTabs = content && content.type.name === 'Tabs';
  const renderContentOutside =
    (hasTabs && headerMode === HEADER_MODES.DYNAMIC) || headerMode === HEADER_MODES.STICKY;

  return (
    <div
      className={classnames(className, 'page-title-bar', {
        'page-title-bar--sticky': headerMode === HEADER_MODES.STICKY,
        'page-title-bar--condensed-static': headerMode === HEADER_MODES.CONDENSED,
        'page-title-bar--dynamic--before': headerMode === HEADER_MODES.DYNAMIC && !condensed,
        'page-title-bar--dynamic--during':
          headerMode === HEADER_MODES.DYNAMIC &&
          condensed &&
          transitionProgress < 1 &&
          transitionProgress > 0,
        'page-title-bar--dynamic--after':
          headerMode === HEADER_MODES.DYNAMIC && condensed && transitionProgress === 1,
        'page-title-bar--dynamic': headerMode === HEADER_MODES.DYNAMIC,
        'page-title-bar--with-actions': upperActions && headerMode === HEADER_MODES.DYNAMIC,
      })}
      style={{
        '--header-offset': stickyHeaderOffset,
        '--scroll-transition-progress':
          headerMode !== HEADER_MODES.DYNAMIC ? 1 : transitionProgress,
      }}
    >
      {isLoading ? (
        <SkeletonText className="page-title-bar-loading" heading width="30%" />
      ) : (
        <>
          <div className="page-title-bar-header">
            <div className="page-title-bar-breadcrumb-bg" />
            {breadcrumb ||
            upperActions ||
            headerMode === HEADER_MODES.DYNAMIC ||
            headerMode === HEADER_MODES.CONDENSED ? (
              <div className="page-title-bar-breadcrumb breadcrumb--container" ref={breadcrumbRef}>
                <Breadcrumb>
                  {breadcrumb
                    ? breadcrumb.map((crumb, index) => (
                        <BreadcrumbItem key={`breadcrumb-${index}`}>{crumb}</BreadcrumbItem>
                      ))
                    : null}
                  {headerMode === HEADER_MODES.DYNAMIC || headerMode === HEADER_MODES.CONDENSED ? (
                    <span className="page-title-bar-breadcrumb-current" title={title}>
                      {title}
                    </span>
                  ) : null}
                </Breadcrumb>
              </div>
            ) : null}
            {upperActions ? (
              <div className="page-title-bar-actions-upper">{upperActions}</div>
            ) : null}
            <div className="page-title-bar-title" ref={titleRef}>
              <div className="page-title-bar-title--text">
                <h2 title={title}>{title}</h2>
                {titleActions}
              </div>
            </div>
            {description && !collapsed ? (
              <p className="page-title-bar-description">{description}</p>
            ) : null}
            <div className="page-title-bar-header-right">{extraContent || rightContent}</div>
            {titleBarContent && !renderContentOutside ? (
              <div className="page-title-bar-content" ref={contentRef}>
                {titleBarContent}
              </div>
            ) : null}
          </div>

          {titleBarContent && renderContentOutside ? (
            <div
              className={classnames('page-title-bar-content', {
                'page-title-bar-content--active': contentActive,
              })}
              ref={contentRef}
            >
              {titleBarContent}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

PageTitleBar.propTypes = PageTitleBarPropTypes;
PageTitleBar.defaultProps = defaultProps;

export default PageTitleBar;
