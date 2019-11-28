/* TODO
👌1. follow angular 
👌2. pass in <Array>BreadcrumbItems
👌3. threshold, content
4. calculate font size, style, e.g. `valuecard` 76 line
5. `BreadcrumbItem` (as a child) need to be wrapped as a `overviewItem`
  ❌a. check every parameters from `BreadcrumbItem` 
  b. ref
  c. wrap bx--breadcrumb-item style, same with `overviewItem`
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb as CarbonBreadcrumb } from 'carbon-components-react';
import { OverflowMenu, OverflowMenuItem } from 'carbon-components-react';
// import { BreadcrumbTypes } from 'carbon-components-react/lib/prop-types/types';
// import { settings } from 'carbon-components';
import styled from 'styled-components';
import { rem } from 'polished';
import Notification20 from '@carbon/icons-react/lib/notification/20';


const StyledBreadcrumb = styled(CarbonBreadcrumb)`
  
`;

const StyledOverflowMenu = styled(OverflowMenu)`

`;

const MINIMUM_OVERFLOW_THRESHOLD = 14;

const propTypes = { 
    /** Pass in the BreadcrumbItem's for your Breadcrumb */
    children: PropTypes.node,
    /** Specify an optional className to be applied to the container node */
    className: PropTypes.string,
    /** Optional prop to omit the trailing slash for the breadcrumb */
    noTrailingSlash: PropTypes.bool,
    /** Optional prop to do what ???? */
    // arialable: PropTypes.string,
    /** Define to show how many items*/
    threshold: PropTypes.number,
    /**  */
  };
  
const defaultProps = {
  children: null,
  className: null,
  noTrailingSlash: false,
  threshold: 0,
};

const setThreshold = (t) => {
  if(isNaN(t) || t < MINIMUM_OVERFLOW_THRESHOLD){
    return MINIMUM_OVERFLOW_THRESHOLD;
  }
  return t;
}


const XBreadcrumb = ({
  className,
  children,
  noTrailingSlash,
  threshold,
  ...other
}) => {

const _threshold = setThreshold(threshold);
const showOverflow = () => {
  if(!children){
    return false;
  }
  return children.length > _threshold;
}

// const OverflowItems = () => {
//   return showOverflow ? children[0: children.length-2] : null;
// }


return (
    <div className="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
    <StyledBreadcrumb
    {...other}
    className={className}
    noTrailingSlash={noTrailingSlash}
    >
      {showOverflow ? (
          <CarbonBreadcrumb>
            {children[0]}         
            <OverflowMenu renderIcon={Notification20}>          
              {/* {React.Children.map(children,(c, index) => {
                console.log(c)
                return (
                
                    React.cloneElement(c, {
                    noTrailingSlash: true,
                    color: "red",
                    name: index
                    })
                )
              })} */}
              {/* <OverflowMenuItem itemText={"Option 1"} />
              <OverflowMenuItem itemText={"Option 2 is an example of a really long string and how we recommend handling this"} requireTitle/>
              <OverflowMenuItem itemText={"Option 3"} /> */}
            </OverflowMenu>
            {children[children.length - 1]}
          </CarbonBreadcrumb>        
      ) : (
        <div>
          {children}
        </div>
      )}     
    </StyledBreadcrumb>
    </div>
    
);
};

XBreadcrumb.propTypes = propTypes;
XBreadcrumb.defaultProps = defaultProps;


export default XBreadcrumb;