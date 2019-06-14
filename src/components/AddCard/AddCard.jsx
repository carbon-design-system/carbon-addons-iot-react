import { ClickableTile } from 'carbon-components-react';
import { rem } from 'polished';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import Add from '@carbon/icons-react/lib/add/20';

import { COLORS } from '../../styles/styles';

const StyledTile = styled(ClickableTile)`
  &&& {
    border: 1px solid transparent;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: ${COLORS.superLightGray};
    min-height: 8rem;
    min-width: 8.5rem;
    max-width: ${rem(300)};
    max-height: ${rem(250)};
    :focus,
    :hover {
      border: 1px solid ${COLORS.blue};
    }

    svg {
      margin: auto 0 0 auto;
    }
  }
`;

const propTypes = {
  /** Title to show on the card */
  title: PropTypes.string.isRequired,
  /** Callback function when icon is clicked */
  onClick: PropTypes.func.isRequired,
};

/**
 * Clickable card that shows "Add" button
 */
const AddCard = ({ onClick, title, className }) => (
  <StyledTile className={className} handleClick={onClick}>
    <p className="title">{title}</p>
    <Add fill={COLORS.gray100} description={title} />
  </StyledTile>
);

AddCard.propTypes = propTypes;

export default AddCard;
