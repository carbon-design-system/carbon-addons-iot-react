import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { WarningAlt16 } from '@carbon/icons-react';
import { spacing03 } from '@carbon/layout';
import styled from 'styled-components';
import { Tooltip, Button } from 'carbon-components-react';

import { RowActionErrorPropTypes } from '../../TablePropTypes';

const StyledSpan = styled.span`
  margin-left: ${spacing03};
  line-height: 1.875rem;
`;

const StyledTitle = styled.p`
  font-weight: bold;
  margin-bottom: ${spacing03};
`;

const StyledTooltipFooter = styled.div`
  margin-top: ${spacing03};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledTooltipContents = styled.div`
  font-size: 0.875rem;
`;

const propTypes = {
  /** I18N label for action failed */
  actionFailedText: PropTypes.string,
  /** I18N label for learn more */
  learnMoreText: PropTypes.string,
  /** I18N label for dismiss */
  dismissText: PropTypes.string,
  /** did an error occur */
  rowActionsError: RowActionErrorPropTypes,
  onClearError: PropTypes.func,
};

const defaultProps = {
  actionFailedText: 'Action failed',
  learnMoreText: 'Learn more',
  dismissText: 'Dismiss',
  rowActionsError: null,
  onClearError: null,
};

const RowActionsError = ({
  rowActionsError,
  actionFailedText,
  learnMoreText,
  dismissText,
  onClearError,
}) => {
  if (!rowActionsError) {
    return null;
  }
  const { title, message, learnMoreURL } = rowActionsError;
  return rowActionsError ? (
    <Fragment>
      <Tooltip
        clickToOpen
        tabIndex={0}
        triggerText=""
        triggerId="tooltip-error"
        tooltipId="tooltip"
        renderIcon={React.forwardRef((props, ref) => (
          <WarningAlt16 ref={ref} />
        ))}
      >
        <StyledTooltipContents>
          <StyledTitle>{title}</StyledTitle>
          {message}
          <StyledTooltipFooter>
            {learnMoreURL ? (
              <a href={learnMoreURL} target="_blank" rel="noopener noreferrer">
                {learnMoreText}
              </a>
            ) : (
              <div />
            )}
            {onClearError ? (
              <Button
                onClick={evt => {
                  onClearError(evt);
                  evt.stopPropagation();
                }}
              >
                {dismissText}
              </Button>
            ) : null}
          </StyledTooltipFooter>
        </StyledTooltipContents>
      </Tooltip>
      <StyledSpan>{actionFailedText}</StyledSpan>
    </Fragment>
  ) : null;
};

RowActionsError.propTypes = propTypes;
RowActionsError.defaultProps = defaultProps;

export default RowActionsError;
