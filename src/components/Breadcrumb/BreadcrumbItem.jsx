import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { BreadcrumbItem as CarbonBreadcrumbItem } from 'carbon-components-react';

const propTypes = {
  /** Pass in the BreadcrumbItem's for your Breadcrumb */
  children: PropTypes.node,
  getWidth: PropTypes.func,
  // color: PropTypes.string,
};
const defaultProps = {
  children: null,
  getWidth: null,
  // color: '',
};

const BreadcrumbItem = props => {
  const { getWidth, children, ...other } = props;
  const [width, setWidth] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      // getWidth(node.getBoundingClientRect().width)
      // const getWidth1 = () => {
      //   return node.getBoundingClientRect().width;
      // }
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);

  return (
    <div ref={measuredRef} width={width}>
      <CarbonBreadcrumbItem {...other}>{children}</CarbonBreadcrumbItem>
    </div>
  );
};

BreadcrumbItem.propTypes = propTypes;
BreadcrumbItem.defaultProps = defaultProps;
export default BreadcrumbItem;
