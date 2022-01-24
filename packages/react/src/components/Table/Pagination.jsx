import sizeMe from 'react-sizeme';
import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'carbon-components-react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

/**
 * This pagination component hides the items per page selection dropdown if the isItemsPerPageHidden bit is true.
 * It also hides the Items per page and x of x items text if the total width of the pagination bar is less than 500 px
 */
const SizedPagination = sizeMe({ noPlaceholder: true })(
  ({
    isItemPerPageHidden,
    size,
    className,
    preventInteraction,
    disabled,
    testId,
    carbonSize,
    ...rest
  }) => (
    <Pagination
      {...rest}
      size={carbonSize}
      data-testid={testId}
      disabled={preventInteraction || disabled}
      className={classnames(className, `${iotPrefix}--pagination`, {
        [`${iotPrefix}--pagination--hide-page`]: isItemPerPageHidden,
        [`${iotPrefix}--pagination--hide-select`]: preventInteraction,
      })}
      style={{
        '--pagination-text-display': size?.width && size?.width < 500 ? 'none' : 'flex',
      }}
    />
  )
);

SizedPagination.propTypes = {
  isItemPerPageHidden: PropTypes.bool,
  // It is currently not possible to completely disable the carbon pagination
  // therefor we use this prop to combine disable and hiding of controls.
  preventInteraction: PropTypes.bool,
};
SizedPagination.defaultProps = {
  isItemPerPageHidden: false,
  preventInteraction: false,
};

export default SizedPagination;
