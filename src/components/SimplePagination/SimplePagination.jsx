import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CaretLeft from '@carbon/icons-react/lib/caret--left/20';
import CaretRight from '@carbon/icons-react/lib/caret--right/20';

import { handleEnterKeyDown } from '../../utils/componentUtilityFunctions';
import { COLORS } from '../../styles/styles';

const StyledContainer = styled.div`
  &&& {
    display: flex;
    height: 3rem;
    justify-content: flex-end;
    width: 100%;
    border: 1px solid ${COLORS.gray20};
    background-color: ${COLORS.gray10};
    align-items: center;
  }
`;

const StyledPageLabel = styled.span`
  padding-right: 1rem;
  font-size: 0.875rem;
`;

const StyledButton = styled.div`
  ${props =>
    props.onClick
      ? `` // If the item isn't clickable remove the focus outline
      : `&:focus {
          outline: none;
          border: 1px solid ${COLORS.blue};
        }
        cursor: default;
  `}

  svg path {
    fill: ${COLORS.gray100};
  }
`;

const propTypes = {
  /** current page number */
  page: PropTypes.number.isRequired,
  /** The maximum page number that can be navigated to */
  maxPage: PropTypes.number.isRequired,
  /** Gets called back with arguments (page, maxPage) */
  pageOfPagesText: PropTypes.func,
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
  pageOfPagesText: (page, maxPage) => `Page ${page} of ${maxPage}`,
  pageText: null,
  nextPageText: 'Next page',
  prevPageText: 'Prev page',
};

/** This is a lighter weight pagination component than the default Carbon one */
const SimplePagination = ({
  pageText,
  prevPageText,
  nextPageText,
  pageOfPagesText,
  page,
  maxPage,
  onPage,
}) => {
  const hasPrev = page > 1;
  const hasNext = page <= maxPage - 1;

  const handleNext = () => onPage(page + 1);
  const handlePrev = () => onPage(page - 1);

  return (
    <StyledContainer>
      <StyledPageLabel maxPage={maxPage}>
        {pageText ? `${pageText} ${page}` : pageOfPagesText(page, maxPage)}
      </StyledPageLabel>
      {maxPage > 1 ? (
        <>
          <StyledButton
            className="bx--pagination__button bx--pagination__button--backward"
            role="button"
            tabIndex={hasPrev ? 0 : -1}
            onClick={hasPrev ? handlePrev : undefined}
            onKeyDown={hasPrev ? evt => handleEnterKeyDown(evt, handlePrev) : undefined}
          >
            <CaretLeft description={prevPageText} />
          </StyledButton>
          <StyledButton
            className="bx--pagination__button bx--pagination__button--forward"
            role="button"
            tabIndex={hasNext ? 0 : -1}
            onClick={hasNext ? handleNext : undefined}
            onKeyDown={hasNext ? evt => handleEnterKeyDown(evt, handleNext) : undefined}
          >
            <CaretRight description={nextPageText} />
          </StyledButton>
        </>
      ) : null}
    </StyledContainer>
  );
};

SimplePagination.propTypes = propTypes;
SimplePagination.defaultProps = defaultProps;

export default SimplePagination;
