import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChevronLeft from '@carbon/icons-react/lib/chevron--left/20';
import ChevronRight from '@carbon/icons-react/lib/chevron--right/20';

import { handleEnterKeyDown } from '../../utils/componentUtilityFunctions';
import { COLORS } from '../../styles/styles';

const StyledContainer = styled.div`
  &&& {
    display: flex;
    height: 3rem;
    justify-content: flex-end;
    width: 100%;
    border: 1px solid ${COLORS.lightGrey};
    background-color: ${COLORS.white};
    color: ${COLORS.gray};
    align-items: center;
  }
`;

const StyledPageLabel = styled.span`
  padding-right: 1rem;
  font-size: 0.875rem;
`;

const StyledButton = styled.div`
  cursor: pointer;
  display: flex;
  width: 3rem;
  height: 3rem;
  justify-content: center;
  align-items: center;
  border: 1px solid ${COLORS.lightGrey};
  outline-offset: -3px;

  ${props =>
    props.onClick
      ? `&:hover {
    border: 1px solid ${COLORS.blue};
    svg path {
      fill: ${COLORS.blue};
    }
  }` // If the item isn't clickable remove the focus outline
      : `&:focus {
        outline: none;
        } cursor: default;`}
  svg path {
    fill: ${COLORS.gray};
  }
`;

const propTypes = {
  /** current page number */
  page: PropTypes.number.isRequired,
  /** The maximum page number that can be navigated to */
  maxPage: PropTypes.number.isRequired,
  /** Internationalized label for the word 'Page' */
  pageText: PropTypes.string,
  /** Internationalized label for the word 'Next page' */
  nextPageText: PropTypes.string,
  /** Internationalized label for the word 'Previous page' */
  prevPageText: PropTypes.string,
  /** Callback when the page is changed */
  onPage: PropTypes.func.isRequired,
};

const defaultProps = {
  pageText: 'Page',
  nextPageText: 'Next page',
  prevPageText: 'Prev page',
};

/** This is a lighter weight pagination component than the default Carbon one */
const SimplePagination = ({ pageText, prevPageText, nextPageText, page, maxPage, onPage }) => {
  const hasPrev = page > 1;
  const hasNext = page <= maxPage - 1;

  const handleNext = () => onPage(page + 1);
  const handlePrev = () => onPage(page - 1);

  return (
    <StyledContainer>
      <StyledPageLabel>
        {pageText} {page}
      </StyledPageLabel>
      <StyledButton
        role="button"
        tabIndex={hasPrev ? 0 : -1}
        onClick={hasPrev ? handlePrev : undefined}
        onKeyDown={hasPrev ? evt => handleEnterKeyDown(evt, handlePrev) : undefined}>
        <ChevronLeft description={prevPageText} />
      </StyledButton>
      <StyledButton
        role="button"
        tabIndex={hasNext ? 0 : -1}
        onClick={hasNext ? handleNext : undefined}
        onKeyDown={hasNext ? evt => handleEnterKeyDown(evt, handleNext) : undefined}>
        <ChevronRight description={nextPageText} />
      </StyledButton>
    </StyledContainer>
  );
};

SimplePagination.propTypes = propTypes;
SimplePagination.defaultProps = defaultProps;

export default SimplePagination;
