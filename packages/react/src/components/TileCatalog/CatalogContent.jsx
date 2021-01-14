import React from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  /** optional icon to visually describe catalog item */
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
};

const defaultProps = {
  icon: null,
  description: null,
};
/** Reusable widget to show Catalog contents in a tile catalog */
const CatalogContent = ({ icon, title, description }) => (
  <div className={`${iotPrefix}--sample-tile`}>
    {icon ? <div className={`${iotPrefix}--sample-tile-icon`}>{icon}</div> : null}
    <div className={`${iotPrefix}--sample-tile-contents`}>
      <div className={`${iotPrefix}--sample-tile-title`}>
        <span title={title}>{title}</span>
      </div>
      <div className={`${iotPrefix}--sample-tile-description`}>{description}</div>
    </div>
  </div>
);

CatalogContent.propTypes = propTypes;
CatalogContent.defaultProps = defaultProps;
export default CatalogContent;
