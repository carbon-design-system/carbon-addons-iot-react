import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import classNames from 'classnames';
import { Information20, Edit20 } from '@carbon/icons-react';
import { Breadcrumb, BreadcrumbItem, Tooltip, SkeletonText, Tabs } from 'carbon-components-react';

import deprecate from '../../internal/deprecate';
import Button from '../Button';

const PageTitleBarPropTypes = {
  /** Title of the page  */
  title: PropTypes.node.isRequired,
  /** Details about what the page shows */
  description: PropTypes.node,
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
  i18n: { editIconDescription: 'Edit page title' },
  isLoading: false,
  tabs: undefined,
  content: undefined,
};

const PageTitleBar = ({
  title,
  description,
  className,
  rightContent,
  extraContent,
  breadcrumb,
  collapsed,
  editable,
  isLoading,
  i18n: { editIconDescription },
  onEdit,
  tabs,
  content,
}) => {
  //
  const titleBarContent = content || tabs;
  return (
    <div className={classNames(className, 'page-title-bar')}>
      {isLoading ? (
        <SkeletonText className="page-title-bar-loading" heading width="30%" />
      ) : (
        <Fragment>
          <div className="page-title-bar-header">
            <div>
              {breadcrumb ? (
                <div className="page-title-bar-breadcrumb">
                  <Breadcrumb>
                    {breadcrumb.map((crumb, index) => (
                      <BreadcrumbItem key={`breadcrumb-${index}`}>{crumb}</BreadcrumbItem>
                    ))}
                  </Breadcrumb>
                </div>
              ) : null}
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
                    >
                      <p>{description}</p>
                    </Tooltip>
                  ) : null}
                  {editable ? (
                    <Button
                      className="page-title-bar-title--edit"
                      kind="ghost"
                      size="small"
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
              {description && !collapsed && !titleBarContent ? (
                <p className="page-title-bar-description">{description}</p>
              ) : null}
            </div>
            {extraContent || rightContent ? (
              <Fragment>
                <div style={{ flex: 1 }} />
                <div>{extraContent || rightContent}</div>
              </Fragment>
            ) : null}
          </div>
          {titleBarContent ? <div className="page-title-bar-content">{titleBarContent}</div> : null}
        </Fragment>
      )}
    </div>
  );
};

PageTitleBar.propTypes = PageTitleBarPropTypes;
PageTitleBar.defaultProps = defaultProps;

export default PageTitleBar;
