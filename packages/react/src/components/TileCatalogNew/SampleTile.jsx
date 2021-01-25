import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /** Title for sample tile */
  title: PropTypes.string.isRequired,
  /** A descriptioni for sample tile */
  description: PropTypes.string,
};

const defaultProps = { description: 'Default description for sample tile' };

const SampleTile = ({ title, description }) => (
  <div className="sample-tile">
    <div className="sample-tile--title">{title}</div>
    <div className="sample-tile--content">{description}</div>
  </div>
);

SampleTile.propTypes = propTypes;
SampleTile.defaultProps = defaultProps;

export default SampleTile;
