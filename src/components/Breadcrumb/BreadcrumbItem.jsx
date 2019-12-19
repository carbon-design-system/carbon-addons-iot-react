import React from 'react';
import PropTypes from 'prop-types';
import { BreadcrumbItem as CarbonBreadcrumbItem } from 'carbon-components-react';

const propTypes = {
  /** Pass in the BreadcrumbItem's for your Breadcrumb */
  children: PropTypes.node,
};
const defaultProps = {
  children: null,
};

const BreadcrumbItem = React.forwardRef((props, ref) => {
  const { children, ...other } = props;

  return (
    <div ref={ref}>
      <CarbonBreadcrumbItem {...other}>{children}</CarbonBreadcrumbItem>
    </div>
  );
});

BreadcrumbItem.propTypes = propTypes;
BreadcrumbItem.defaultProps = defaultProps;
export default BreadcrumbItem;
