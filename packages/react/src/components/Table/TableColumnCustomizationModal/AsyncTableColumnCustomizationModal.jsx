import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import TableColumnCustomizationModal, {
  propTypes as tableColumnCustomizationModalPropTypes,
  defaultProps as tableColumnCustomizationModalDefaultProps,
} from './TableColumnCustomizationModal';

const propTypes = {
  ...tableColumnCustomizationModalPropTypes,
  /**
   * A promise that when resolved returns all the selectable columns as
   * specified in the 'availableColumns' prop of the underlying TableColumnCustomizationModal
   */
  availableColumns: PropTypes.shape({
    then: PropTypes.func.isRequired,
    catch: PropTypes.func.isRequired,
  }).isRequired,
};

const AsyncTableColumnCustomizationModal = ({
  availableColumns: availableColumnsPromise,
  onLoadMore: onLoadMoreCallback,
  ...rest
}) => {
  const [showLoaderInAvailableList, setShowLoaderInAvailableList] = useState(true);
  const [showLoaderInSelectedList, setShowLoaderInSelectedList] = useState(true);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [loadingMoreIds, setLoadingMoreIds] = useState([]);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const alreadyShowingSmallLoader = loadingMoreIds.length > 0;
    setShowLoaderInAvailableList(!alreadyShowingSmallLoader);
    setShowLoaderInSelectedList(!alreadyShowingSmallLoader);

    availableColumnsPromise
      .then((columns) => {
        setShowLoaderInAvailableList(false);
        setShowLoaderInSelectedList(false);
        setAvailableColumns(columns);
        setLoadError(null);
      })
      .catch((error) => {
        setLoadError(`${error}`);
        setShowLoaderInAvailableList(false);
        setShowLoaderInSelectedList(false);
      });
  }, [availableColumnsPromise, loadingMoreIds]);

  const handleOnLoadMore = (id) => {
    onLoadMoreCallback(id);
    setLoadingMoreIds([id]);
  };

  return (
    <TableColumnCustomizationModal
      {...rest}
      availableColumns={availableColumns}
      isPrimaryButtonDisabled={
        (showLoaderInAvailableList && showLoaderInSelectedList) || !!loadError
      }
      loadingMoreIds={loadingMoreIds}
      onLoadMore={handleOnLoadMore}
      showLoaderInAvailableList={showLoaderInAvailableList}
      showLoaderInSelectedList={showLoaderInSelectedList}
      error={loadError}
    />
  );
};

AsyncTableColumnCustomizationModal.propTypes = propTypes;
AsyncTableColumnCustomizationModal.defaultProps = tableColumnCustomizationModalDefaultProps;
export default AsyncTableColumnCustomizationModal;
