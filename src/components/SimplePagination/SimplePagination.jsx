import React from 'react';
import PropTypes from 'prop-types';
import CaretLeft from '@carbon/icons-react/lib/caret--left/20';
import CaretRight from '@carbon/icons-react/lib/caret--right/20';

import { settings } from '../../constants/Settings';
import { handleEnterKeyDown } from '../../utils/componentUtilityFunctions';

const { iotPrefix } = settings;
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
    <div className={`${iotPrefix}-simple-pagination-container`}>
      <span className={`${iotPrefix}-simple-pagination-page-label`} maxpage={maxPage}>
        {pageText ? `${pageText} ${page}` : pageOfPagesText(page, maxPage)}
      </span>
      {maxPage > 1 ? (
        <>
          <div
            className={
              hasPrev
                ? `bx--pagination__button bx--pagination__button--backward ${iotPrefix}-simple-pagination-button`
                : 'bx--pagination__button bx--pagination__button--backward'
            }
            role="button"
            tabIndex={hasPrev ? 0 : -1}
            onClick={hasPrev ? handlePrev : undefined}
            onKeyDown={hasPrev ? evt => handleEnterKeyDown(evt, handlePrev) : undefined}
          >
            <CaretLeft
              description={prevPageText}
              className={`${iotPrefix}-simple-pagination-caret`}
            />
          </div>
          <div
            className={
              hasNext
                ? `bx--pagination__button bx--pagination__button--forward ${iotPrefix}-simple-pagination-button`
                : 'bx--pagination__button bx--pagination__button--forward'
            }
            role="button"
            tabIndex={hasNext ? 0 : -1}
            onClick={hasNext ? handleNext : undefined}
            onKeyDown={hasNext ? evt => handleEnterKeyDown(evt, handleNext) : undefined}
          >
            <CaretRight
              description={nextPageText}
              className={`${iotPrefix}-simple-pagination-caret`}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

SimplePagination.propTypes = propTypes;
SimplePagination.defaultProps = defaultProps;

export default SimplePagination;
