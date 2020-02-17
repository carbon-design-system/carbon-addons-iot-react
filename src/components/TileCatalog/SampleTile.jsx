import React from 'react';

const SampleTile = ({ title, description }) => (
  <div className="sample-tile">
    <div className="sample-tile--title">{title}</div>
    <div className="sample-tile--content">{description}</div>
  </div>
);

export default SampleTile;
