import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'carbon-components-react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import useSizeObserver from '../../hooks/useSizeObserver';

const { iotPrefix } = settings;

const PAGINATION_MIN_WIDTH_LG_BREAKPOINT = 625;

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
  const isCompact = width < 500;

  return (
    <>
      <Pagination
        {...rest}
        forwardedRef={paginationRef}
        size={size}
        data-testid={testId}
        disabled={preventInteraction || disabled}
        className={classnames(className, `${iotPrefix}--pagination`, {
          [`${iotPrefix}--pagination--hide-page`]:
            isItemPerPageHidden || width < PAGINATION_MIN_WIDTH_LG_BREAKPOINT,
          [`${iotPrefix}--pagination--hide-select`]: preventInteraction,
          [`${iotPrefix}--pagination--compact`]: isCompact,
        })}
        style={{
          '--pagination-text-display': isCompact ? 'none' : 'flex',
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
