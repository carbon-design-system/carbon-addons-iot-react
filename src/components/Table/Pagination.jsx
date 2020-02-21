import sizeMe from 'react-sizeme';
import React from 'react';
import { Pagination } from 'carbon-components-react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const SizedPagination = sizeMe({ noPlaceholder: true })(
  ({ isItemPerPageHidden, size, className, ...rest }) => (
    <Pagination
      {...rest}
      className={classnames(className, `${iotPrefix}--pagination`, {
        [`${iotPrefix}--pagination--hide-page`]: isItemPerPageHidden,
      })}
      style={{ '--pagination-text-display': size?.width && size?.width < 500 ? 'none' : 'flex' }}
    />
  )
);

export default SizedPagination;
