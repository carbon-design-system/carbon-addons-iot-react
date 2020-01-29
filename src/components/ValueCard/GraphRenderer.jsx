import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CARD_LAYOUTS } from '../../constants/LayoutConstants';

const GraphWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  ${props =>
    props.layout === CARD_LAYOUTS.HORIZONTAL &&
    `
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-around;
    padding: 0 1rem;
    `}
  ${props =>
    props.layout === CARD_LAYOUTS.VERTICAL &&
    `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 0 0 0.5rem;
    `}
`;

const propTypes = {
  isVisible: PropTypes.bool,
  cricleSize: PropTypes.number,
  strokeWidth: PropTypes.number,
  circleColor: PropTypes.string,
  layout: PropTypes.string,
  isMini: PropTypes.bool,
  score: PropTypes.number,
  thresholdRange: PropTypes.arrayOf(
    PropTypes.shape({
      lower: PropTypes.number,
      upper: PropTypes.number,
      color: PropTypes.string,
      rangename: PropTypes.string,
    })
  ),
};

const defaultProps = {
  isVisible: true,
  cricleSize: 50,
  strokeWidth: 5,
  circleColor: '#DAE2E5',
  score: 0,
  layout: null,
  isMini: false,
  thresholdRange: [
    {
      lower: 80,
      upper: 100,
      color: '#4b8400',
      rangename: 'GOOD',
    },
  ],
};

/** This components job is determining how to render different kinds of card values */
const GraphRenderer = ({
  thresholdRange,
  score,
  isVisible,
  strokeWidth,
  cricleSize,
  circleColor,
  layout,
  isMini,
}) => {
  const halfSize = cricleSize * 0.5;
  const radius = halfSize - strokeWidth * 0.5;
  const circumFerence = 2 * Math.PI * radius;
  const strokeVal = (score * circumFerence) / 100;
  const trackstyle = { strokeWidth };
  const indicatorstyle = {
    strokeWidth,
    strokeDasharray: `${strokeVal} ${circumFerence}`,
  };
  const rotateval = `rotate(-90 ${halfSize},${halfSize})`;
  const graphData = thresholdRange
    .filter(obj => {
      return obj.lower < score && obj.upper > score;
    })
    .concat([null])[0];

  return isVisible && graphData ? (
    <GraphWrapper layout={layout} isMini={isMini}>
      <svg width="100%" height="100%" viewBox="0 0 50 50" className="donutchart">
        <circle
          r={radius}
          cx={halfSize}
          cy={halfSize}
          transform={rotateval}
          stroke={circleColor}
          style={trackstyle}
          fill="transparent"
          className="donutchart-track"
        />
        <circle
          r={radius}
          cx={halfSize}
          cy={halfSize}
          transform={rotateval}
          stroke={graphData.color}
          style={indicatorstyle}
          fill="transparent"
          className="donutchart-indicator"
        />
        <g className="donutchart-text">
          <text x="50%" y="50%" className="donutchart-text-value">
            {score}
          </text>
          <text x="50%" y="50%" className="donutchart-text-label">
            {graphData.rangename}
          </text>
        </g>
      </svg>
    </GraphWrapper>
  ) : null;
};
GraphRenderer.propTypes = propTypes;
GraphRenderer.defaultProps = defaultProps;

export default GraphRenderer;
