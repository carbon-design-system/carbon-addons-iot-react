import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'carbon-components-react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import useSizeObserver from '../../hooks/useSizeObserver';

const { iotPrefix } = settings;

/**
 * This pagination component hides the items per page selection dropdown if the isItemsPerPageHidden bit is true.
 * It also hides the Items per page and x of x items text if the total width of the pagination bar is less than 500 px
 */
const SizedPagination = ({
  isItemPerPageHidden,
  className,
  preventInteraction,
  disabled,
  testId,
  size,
  ...rest
}) => {
  const [{ width }, paginationRef] = useSizeObserver({ initialWidth: 500 });
  return (
    <>
      {/** empty div to fill the width of the pagination area so we don't have to wrap the pagination
       * in a div and cause lots of changes to snapshots. Hopefully, we can soon pass a ref to pagination
       * and remove this. See: https://github.com/carbon-design-system/carbon/pull/10239
       */}
      <div ref={paginationRef} />
      <Pagination
        {...rest}
        size={size}
        data-testid={testId}
        disabled={preventInteraction || disabled}
        className={classnames(className, `${iotPrefix}--pagination`, {
          [`${iotPrefix}--pagination--hide-page`]: isItemPerPageHidden,
          [`${iotPrefix}--pagination--hide-select`]: preventInteraction,
        })}
        style={{
          '--pagination-text-display': width < 500 ? 'none' : 'flex',
        }}
      />
    </>
  );
};

SizedPagination.propTypes = {
  isItemPerPageHidden: PropTypes.bool,
  // It is currently not possible to completely disable the carbon pagination
  // therefor we use this prop to combine disable and hiding of controls.
  preventInteraction: PropTypes.bool,

  disabled: PropTypes.bool,

  size: PropTypes.oneOf(['sm', 'md', 'lg']),

  testId: PropTypes.string,
};

SizedPagination.defaultProps = {
  isItemPerPageHidden: false,
  preventInteraction: false,
  disabled: false,
  testId: 'sized-pagination',
  size: 'lg',
};

export default SizedPagination;
