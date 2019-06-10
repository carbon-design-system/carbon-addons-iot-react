import { ClickableTile } from 'carbon-components-react';
import { rem } from 'polished';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import Add from '@carbon/icons-react/lib/add--alt/32';

import { COLORS } from '../../styles/styles';

const StyledTile = styled(ClickableTile)`
   {
    border: 1px solid transparent;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${COLORS.superLightGray};
    min-width: ${rem(200)};
    max-width: ${rem(300)};
    max-height: ${rem(250)};
    text-align: center;
    :focus,
    :hover {
      border: 1px solid ${COLORS.blue};
    }
  }
`;
const StyledIcon = styled(Add)`
   {
    width: ${rem(56)};
    height: ${rem(56)};
    margin-bottom: 1rem;
  }
`;
const Title = styled.p`
   {
    color: gray;
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
    <StyledIcon fill="grey" description={title} />
    <Title className="title">{title}</Title>
  </StyledTile>
);

AddCard.propTypes = propTypes;

export default AddCard;
