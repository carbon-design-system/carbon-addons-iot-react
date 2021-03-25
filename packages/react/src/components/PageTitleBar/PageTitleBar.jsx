import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Information20, Edit20 } from '@carbon/icons-react';
import { Breadcrumb, BreadcrumbItem, Tooltip, SkeletonText, Tabs } from 'carbon-components-react';
import throttle from 'lodash/throttle';

import deprecate from '../../internal/deprecate';
import Button from '../Button';

const PageTitleBarPropTypes = {
  /** Title of the page  */
  title: PropTypes.node.isRequired,
  /** Details about what the page shows */
  description: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
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
  sticky: false,
  isDynamic: true,
  condensed: false,
};

const PageTitleBar = ({
  title,
  description,
  className,
  rightContent,
  extraContent,
  breadcrumb,
  collapsed,
  isDynamic,
  sticky,
  condensed: condensedProp,
  editable,
  isLoading,
  i18n: { editIconDescription, tooltipIconDescription },
  onEdit,
  tabs,
  content,
}) => {
  const titleBarContent = content || tabs;
  const [condensed, setCondensed] = useState(condensedProp);

  useEffect(() => {
    if (isDynamic) {
      window.addEventListener(
        'scroll',
        throttle(() => {
          if (Math.round(window.scrollY) > 5) {
            setCondensed(true);
          } else {
            setCondensed(false);
          }
        }, 120)
      );
    }
    return () => window.removeEventListener('scroll');
  }, [isDynamic]);

  return !isDynamic || condensedProp ? (
    <div className={classnames(className, 'page-title-bar')}>
      {isLoading ? (
        <SkeletonText className="page-title-bar-loading" heading width="30%" />
      ) : (
        <>
          <div
            className={classnames('page-title-bar-header', {
              'page-title-bar-header-sticky': sticky,
              'page-title-bar-header-condensed': condensed,
            })}
          >
            <div className="page-title-bar-header-left">
              {breadcrumb ? (
                <div
                  className={classnames('page-title-bar-breadcrumb', {
                    'page-title-bar-breadcrumb-condensed-static': condensed,
                  })}
                >
                  <Breadcrumb>
                    {breadcrumb.map((crumb, index) => (
                      <BreadcrumbItem key={`breadcrumb-${index}`}>{crumb}</BreadcrumbItem>
                    ))}
                  </Breadcrumb>
                  {condensed ? (
                    <div
                      className={classnames('page-title-bar-title', {
                        'page-title-bar-title-condensed-static': condensed,
                      })}
                    >
                      <div className="page-title-bar-title--text">
                        <span>{title}</span>
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
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
              {!condensed && (
                <div className="page-title-bar-title">
                  <div className="page-title-bar-title--text">
                    <h2>{title}</h2>
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
          {/* <div
            className={classnames('page-title-bar-header', {
              'page-title-bar-header-sticky': sticky,
              'page-title-bar-header-condensed': condensed,
            })}
          > */}
          {/* <div className="page-title-bar-header-left"> */}
          {breadcrumb ? (
            <div
              className={classnames('page-title-bar-breadcrumb', {
                'page-title-bar-breadcrumb-condensed': condensed,
                'page-title-bar-breadcrumb-dynamic': isDynamic,
              })}
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
                {title}
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
              </div>
            </div>
          ) : null}
          <div
            className={classnames('page-title-bar-title', {
              'page-title-bar-title-dynamic': isDynamic,
            })}
          >
            {/* {!condensed && ( */}
            <div className="page-title-bar-title--text">
              <h2>{title}</h2>
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
            </div>
            {/* )} */}
          </div>
          {description && !collapsed && !titleBarContent ? (
            <p className="page-title-bar-description">{description}</p>
          ) : null}
          {/* </div> */}
          {extraContent || rightContent ? (
            <div
              className={classnames('page-title-bar-header-right', {
                'page-title-bar-header-right-dynamic': isDynamic,
              })}
            >
              {extraContent || rightContent}
            </div>
          ) : null}
          {/* </div> */}
          {titleBarContent ? <div className="page-title-bar-content">{titleBarContent}</div> : null}
        </>
      )}
    </div>
  );
};

PageTitleBar.propTypes = PageTitleBarPropTypes;
PageTitleBar.defaultProps = defaultProps;

export default PageTitleBar;
