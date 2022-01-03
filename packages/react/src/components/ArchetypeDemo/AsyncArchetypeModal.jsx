// TODO: Wrap ArchetypeModal and make the data async
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  ArchetypeModal,
  propTypes as archetypeModalPropTypes,
  defaultProps as archetypeModalDefaultProps,
} from './ArchetypeModal';

const propTypes = {
  ...archetypeModalPropTypes,
  /**
   * A promise that when resolved returns all the data as
   * specified in the 'data' prop of the underlying ArchetypeModal
   */
  data: PropTypes.shape({
    then: PropTypes.func.isRequired,
    catch: PropTypes.func.isRequired,
  }).isRequired,
};

const AsyncArchetypeModal = ({ data: dataPromise, ...rest }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [myData, setMyData] = useState([]);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    dataPromise
      .then((data) => {
        setShowLoader(false);
        setMyData(data);
        setLoadError(null);
      })
      .catch((error) => {
        setLoadError(`${error}`);
        setShowLoader(false);
      });
  }, [dataPromise]);

  return (
    <ArchetypeModal
      {...rest}
      data={myData}
      isLoading={showLoader || !!loadError}
      error={loadError}
    />
  );
};

AsyncArchetypeModal.propTypes = propTypes;
AsyncArchetypeModal.defaultProps = archetypeModalDefaultProps;
export default AsyncArchetypeModal;
