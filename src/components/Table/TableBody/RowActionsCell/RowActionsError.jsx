import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Warn from '@carbon/icons-react/lib/warning--alt/16';
import styled from 'styled-components';

import { RowActionErrorPropTypes } from '../../TablePropTypes';

const StyledSpan = styled.span`
  margin-left: 0.5rem;
`;

const propTypes = {
  /** I18N label for action failed */
  actionFailedText: PropTypes.string,
  /** I18N label for learn more */
  learnMoreText: PropTypes.string, // eslint-disable-line
  /** I18N label for dismiss */
  dismissText: PropTypes.string, // eslint-disable-line
  /** did an error occur */
  rowActionsError: RowActionErrorPropTypes,
};

const defaultProps = {
  actionFailedText: 'Action failed',
  learnMoreText: 'Learn more',
  dismissText: 'Dismiss',
  rowActionsError: null,
};

const RowActionsError = ({
  rowActionsError,
  actionFailedText,
  // learnMoreText,
  // dismissText
}) => {
  return rowActionsError ? (
    <Fragment>
      <Warn />
      <StyledSpan>{actionFailedText}</StyledSpan>
    </Fragment>
  ) : null;
};

RowActionsError.propTypes = propTypes;
RowActionsError.defaultProps = defaultProps;

export default RowActionsError;
