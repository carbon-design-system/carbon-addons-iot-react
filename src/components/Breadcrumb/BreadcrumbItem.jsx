import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'carbon-components-react';
import { settings } from 'carbon-components';
import cx from 'classnames';

const { prefix } = settings;

const propTypes = {
  'aria-current': PropTypes.string,
  /**
   * Pass in content that will be inside of the BreadcrumbItem
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the container node
   */
  className: PropTypes.string,

  /**
   * Optional string representing the link location for the BreadcrumbItem
   */
  href: PropTypes.string,

  /**
   * Provide if this breadcrumb item represents the current page
   */
  isCurrentPage: PropTypes.bool,
};
const defaultProps = {
  'aria-current': null,
  children: null,
  className: null,
  href: null,
  isCurrentPage: false,
};

const BreadcrumbItem = React.forwardRef((props, ref) => {
  const {
    'aria-current': ariaCurrent,
    children,
    className: customClassName,
    href,
    isCurrentPage,
    ...rest
  } = props;

  const className = cx({
    [`${prefix}--breadcrumb-item`]: true,
    // We set the current class only if `isCurrentPage` is passed in and we do
    // not have an `aria-current="page"` set for the breadcrumb item
    [`${prefix}--breadcrumb-item--current`]: isCurrentPage && ariaCurrent !== 'page',
    [customClassName]: !!customClassName,
  });

  if (typeof children === 'string' && href) {
    return (
      <li className={className} {...rest} ref={ref}>
        <Link href={href} aria-current={ariaCurrent}>
          {children}
        </Link>
      </li>
    );
  }

  return (
    <li className={className} {...rest} ref={ref}>
      {React.cloneElement(children, {
        'aria-current': ariaCurrent,
        className: `${prefix}--link`,
      })}
    </li>
  );
});

BreadcrumbItem.propTypes = propTypes;
BreadcrumbItem.defaultProps = defaultProps;
export default BreadcrumbItem;
