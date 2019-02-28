import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classnames from 'classnames';

/**
 * This is a temporary override of carbon to support clicking on the progress step
 * It also adds the ability to hide labels and provide a custom stepWidth.  Put in a PR on the Carbon team
 * so that most of this capability can be removed/refactored when we update to the latest Carbon.
 * https://github.com/IBM/carbon-components-react/pull/1945
 */
const ProgressStep = ({
  key,
  label,
  description,
  current,
  complete,
  showLabel,
  onClick,
  className,
}) => {
  const classNames = classnames('bx--progress-step', 'bx--progress-step--complete', className);
  const stepComplete = (
    <li key={key} className={classNames}>
      <svg
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        aria-hidden="true"
        onClick={onClick}>
        <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 13c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" />
        <path d="M7 10.8L4.5 8.3l.8-.8L7 9.2l3.7-3.7.8.8z" />
        <title>{description}</title>
      </svg>
      <button type="button" onClick={onClick} className="bx--progress-label">
        {showLabel ? label : null}
      </button>
      <span className="bx--progress-line" />
    </li>
  );

  const stepCurrent = (
    <li key={key} className={classNames}>
      <svg>
        <circle cx="12" cy="12" r="12" />
        <circle cx="12" cy="12" r="6" />
        <title>{description}</title>
      </svg>
      <p className="bx--progress-label">{label}</p>
      <span className="bx--progress-line" />
    </li>
  );

  const stepIncomplete = (
    <li key={key} className={classNames}>
      <svg onClick={onClick}>
        <circle cx="12" cy="12" r="12" />
        <title>{description}</title>
      </svg>
      <button type="button" onClick={onClick} className="bx--progress-label">
        {showLabel ? label : null}
      </button>
      <span className="bx--progress-line" />
    </li>
  );

  if (complete) {
    return stepComplete;
  }
  if (current) {
    return stepCurrent;
  }
  return stepIncomplete;
};

ProgressStep.propTypes = {
  key: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  current: PropTypes.bool,
  complete: PropTypes.bool,
  description: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  /** NEW PROPS! optionally hide Labels */
  showLabel: PropTypes.bool,
  /** attach the click handler here */
  onClick: PropTypes.func,
  /** Support dynamically passing a pixel width */
  stepWidth: PropTypes.number,
};

/* Display name */
ProgressStep.displayName = 'ProgressStep';

const StyledProgressStep = styled(ProgressStep)`
  &&& {
    min-width: 136px;
    width: ${props => props.stepWidth};
    .bx--progress-label {
      cursor: pointer;
    }
    .bx--progress-step svg {
      z-index: auto;
      cursor: pointer;
    }
    button {
      background: none;
      margin: 0;
      padding: 0;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      text-align: left;
      color: ${props => (props.status === 'incomplete' ? '#5a6872' : '#3d70b2')};
    }
  }
`;

export default StyledProgressStep;
