import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import classNames from 'classnames';
import { Information24, Edit24 } from '@carbon/icons-react';
import { Breadcrumb, BreadcrumbItem, Tooltip, SkeletonText } from 'carbon-components-react';

import Button from '../Button';

const HeroPropTypes = {
  /** Title of the page  */
  title: PropTypes.node.isRequired,
  /** Details about what the page shows */
  description: PropTypes.node,
  /** Optional node to render in the right side of the hero */
  rightContent: PropTypes.node,
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
};

const defaultProps = {
  description: null,
  className: null,
  rightContent: null,
  breadcrumb: null,
  collapsed: false,
  editable: false,
  onEdit: null,
  i18n: { editIconDescription: 'Edit page title' },
  isLoading: false,
};

const Hero = ({
  title,
  description,
  className,
  rightContent,
  breadcrumb,
  collapsed,
  editable,
  isLoading,
  i18n: { editIconDescription },
  onEdit,
}) => (
  <div className={classNames(className, 'hero')}>
    {isLoading ? (
      <SkeletonText className="hero-loading" heading width="30%" />
    ) : (
      <Fragment>
        {breadcrumb ? (
          <div className="hero-breadcrumb">
            <Breadcrumb>
              {breadcrumb.map((crumb, index) => (
                <BreadcrumbItem key={`breadcrumb-${index}`}>{crumb}</BreadcrumbItem>
              ))}
            </Breadcrumb>
          </div>
        ) : null}
        <div className="hero-title">
          <div className="hero-title--text">
            <h2>{title}</h2>
            {collapsed ? (
              <Tooltip tabIndex={0} triggerText="" triggerId="tooltip" renderIcon={Information24}>
                <p>{description}</p>
              </Tooltip>
            ) : null}
            {editable ? (
              <Button
                className="hero-title--edit"
                kind="ghost"
                hasIconOnly
                renderIcon={Edit24}
                iconDescription={editIconDescription}
                tooltipAlignment="center"
                tooltipPosition="bottom"
                onClick={onEdit}
              />
            ) : null}
          </div>
          {rightContent}
        </div>
        {description && !collapsed ? <p className="hero-description">{description}</p> : null}
      </Fragment>
    )}
  </div>
);

Hero.propTypes = HeroPropTypes;
Hero.defaultProps = defaultProps;

export default Hero;
