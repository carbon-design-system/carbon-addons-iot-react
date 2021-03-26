import PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo } from 'react';
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
  headerMode: PropTypes.oneOf(Object.values(HEADER_MODES)),
  headerModeDynamicOffSet: PropTypes.number,
  /** Optional node to render in the right side of the PageTitleBar
   *  NOTE: Deprecated in favor of extraContent
   */
  rightContent: deprecate(
    PropTypes.node,
    '\nThe prop `rightContent` for PageTitleBar has been deprecated in favor of `extraContent`'
  ),
  /** Optional node to render to the side of the PageTitleBar */
  extraContent: PropTypes.node,
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
  headerModeDynamicOffSet: 0,
};

const PageTitleBar = ({
  title,
  description,
  className,
  rightContent,
  extraContent,
  breadcrumb,
  collapsed,
  headerMode,
  headerModeDynamicOffSet,
  editable,
  isLoading,
  i18n: { editIconDescription, tooltipIconDescription },
  onEdit,
  tabs,
  content,
}) => {
  const titleBarContent = content || tabs;
  const [condensed, setCondensed] = useState(headerMode === HEADER_MODES.CONDENSED);

  useEffect(() => {
    // if we have scrolled passed the offset, we should be in condensed state
    const handleScroll = throttle(() => {
      if (Math.round(window.scrollY) > 5 + headerModeDynamicOffSet) {
        setCondensed(true);
      } else {
        setCondensed(false);
      }
    }, 120);

    if (headerMode === HEADER_MODES.DYNAMIC) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerMode, headerModeDynamicOffSet]);

  const titleActions = useMemo(
    () => (
      <>
        {description && (collapsed || titleBarContent) ? (
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
    [
      collapsed,
      description,
      editIconDescription,
      editable,
      onEdit,
      titleBarContent,
      tooltipIconDescription,
    ]
  );

  return headerMode !== HEADER_MODES.DYNAMIC ? (
    <div className={classnames(className, 'page-title-bar')}>
      {isLoading ? (
        <SkeletonText className="page-title-bar-loading" heading width="30%" />
      ) : (
        <>
          <div
            className={classnames('page-title-bar-header', {
              'page-title-bar-header-sticky': headerMode === HEADER_MODES.STICKY,
              'page-title-bar-header-condensed': headerMode === HEADER_MODES.CONDENSED,
            })}
          >
            <div className="page-title-bar-header-left">
              {breadcrumb ? (
                <div
                  className={classnames('page-title-bar-breadcrumb', {
                    'page-title-bar-breadcrumb-condensed-static':
                      headerMode === HEADER_MODES.CONDENSED,
                  })}
                >
                  <Breadcrumb>
                    {breadcrumb.map((crumb, index) => (
                      <BreadcrumbItem key={`breadcrumb-${index}`}>{crumb}</BreadcrumbItem>
                    ))}
                  </Breadcrumb>
                  {headerMode === HEADER_MODES.CONDENSED ? (
                    <div
                      className={classnames('page-title-bar-title', {
                        'page-title-bar-title--condensed-static':
                          headerMode === HEADER_MODES.CONDENSED,
                      })}
                    >
                      <div className="page-title-bar-title--text">
                        <span>{title}</span>
                        {titleActions}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
              {headerMode !== HEADER_MODES.CONDENSED && (
                <div className="page-title-bar-title">
                  <div className="page-title-bar-title--text">
                    <h2>{title}</h2>
                    {titleActions}
                  </div>
                </div>
              )}
              {description && !collapsed && !titleBarContent ? (
                <p className="page-title-bar-description">{description}</p>
              ) : null}
            </div>
            {extraContent || rightContent ? (
              <div className="page-title-bar-header-right">{extraContent || rightContent}</div>
            ) : null}
          </div>
          {titleBarContent ? <div className="page-title-bar-content">{titleBarContent}</div> : null}
        </>
      )}
    </div>
  ) : (
    <div className="page-title-bar">
      {isLoading ? (
        <SkeletonText className="page-title-bar-loading" heading width="30%" />
      ) : (
        <>
          {breadcrumb ? (
            <div
              className={classnames(
                'page-title-bar-breadcrumb',
                'page-title-bar-breadcrumb-dynamic',
                {
                  'page-title-bar-breadcrumb-condensed': condensed,
                }
              )}
            >
              <Breadcrumb>
                {breadcrumb.map((crumb, index) => (
                  <BreadcrumbItem key={`breadcrumb-${index}`}>{crumb}</BreadcrumbItem>
                ))}
              </Breadcrumb>
              <div
                className={classnames('page-title-bar-title--condensed', {
                  'page-title-bar-title--condensed-before': !condensed,
                  'page-title-bar-title--condensed-after': condensed,
                })}
              >
                <span>{title}</span>
                {titleActions}
              </div>
            </div>
          ) : null}
          <div
            className={classnames('page-title-bar-title', 'page-title-bar-title-dynamic')}
            style={{ '--bar-title-position': extraContent || rightContent ? 'absolute' : 'static' }}
          >
            <div className="page-title-bar-title--text">
              <h2>{title}</h2>
              {titleActions}
            </div>
          </div>
          {description && !collapsed && !titleBarContent ? (
            <p className="page-title-bar-description">{description}</p>
          ) : null}
          {extraContent || rightContent ? (
            <div
              className={classnames(
                'page-title-bar-header-right',
                'page-title-bar-header-right-dynamic'
              )}
            >
              {extraContent || rightContent}
            </div>
          ) : null}
          {titleBarContent ? <div className="page-title-bar-content">{titleBarContent}</div> : null}
        </>
      )}
    </div>
  );
};

PageTitleBar.propTypes = PageTitleBarPropTypes;
PageTitleBar.defaultProps = defaultProps;

export default PageTitleBar;
