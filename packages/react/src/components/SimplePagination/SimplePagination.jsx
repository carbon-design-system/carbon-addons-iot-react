import React from 'react';
import PropTypes from 'prop-types';
import { CaretLeft16, CaretRight16 } from '@carbon/icons-react';

import { settings } from '../../constants/Settings';
import { handleEnterKeyDown } from '../../utils/componentUtilityFunctions';
import deprecate, { deprecateString } from '../../internal/deprecate';
import useMerged from '../../hooks/useMerged';

const { iotPrefix, prefix } = settings;

export const SimplePaginationPropTypes = {
  /** current page number */
  page: PropTypes.number.isRequired,
  /** The maximum page number that can be navigated to */
  maxPage: PropTypes.number.isRequired,
  /** Gets called back with arguments (page, maxPage) */
  pageOfPagesText: deprecate(
    PropTypes.func,
    `The prop \`pageOfPagesText\` has been deprecated for the \`SimplePagination\` component. It will be removed in the next major release. Please use \`i18n.pageOfPagesText\` instead.`
  ),
  /** Internationalized label for the word 'Page' */
  pageText: PropTypes.string,
  /** Internationalized label for the word 'Next page' */
  nextPageText: deprecateString(),
  /** Internationalized label for the word 'Previous page' */
  prevPageText: deprecateString(),
  /** Callback when the page is changed */
  onPage: PropTypes.func.isRequired,
  /** total number of items */
  totalItems: PropTypes.number,
  /** Internationalized label for the word 'Items' or function receiving
   * a param for the total: (total) => `${total} items`} */
  totalItemsText: deprecate(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    `The prop \`totalItemsText\` has been deprecated for the \`SimplePagination\` component. It will be removed in the next major release. Please use \`i18n.totalItemsText\` instead.`
  ),
  // eslint-disable-next-line react/require-default-props
  testID: deprecate(
    PropTypes.string,
    `The 'testID' prop has been deprecated. Please use 'testId' instead.`
  ),
  /** Id that can be used for testing */
  testId: PropTypes.string,
  /** the size of the buttons in pagination */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  i18n: PropTypes.shape({
    /** Gets called back with arguments (page, maxPage) */
    pageOfPagesText: PropTypes.func,
    /** Internationalized label for the word 'Page' */
    pageText: PropTypes.string,
    /** Internationalized label for the word 'Next page' */
    nextPageText: PropTypes.string,
    /** Internationalized label for the word 'Previous page' */
    prevPageText: PropTypes.string,
    /** a param for the total: (total) => `${total} items`} */
    totalItemsText: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  }),
};

const defaultProps = {
  pageOfPagesText: undefined,
  pageText: null,
  nextPageText: undefined,
  prevPageText: undefined,
  totalItemsText: undefined,
  totalItems: undefined,
  testId: `${iotPrefix}-simple-pagination`,
  size: 'lg',
  i18n: {
    pageOfPagesText: (page, maxPage) => `Page ${page} of ${maxPage}`,
    nextPageText: 'Next page',
    prevPageText: 'Prev page',
    totalItemsText: 'Items',
  },
};

/** This is a lighter weight pagination component than the default Carbon one */
const SimplePagination = ({
  pageText,
  prevPageText,
  nextPageText,
  pageOfPagesText,
  totalItemsText,
  totalItems,
  page,
  maxPage,
  onPage,
  // TODO: remove deprecated 'testID' in v3
  testID,
  testId,
  size,
  i18n,
}) => {
  const mergedI18n = useMerged(
    defaultProps.i18n,
    { totalItemsText, pageText, pageOfPagesText, prevPageText, nextPageText },
    i18n
  );
  const hasPrev = page > 1;
  const hasNext = page <= maxPage - 1;

  const handleNext = () => onPage(page + 1);
  const handlePrev = () => onPage(page - 1);

  return (
    <div
      className={`${iotPrefix}-simple-pagination-container ${prefix}--pagination--${size}`}
      data-testid={testID || testId}
    >
      {totalItems ? (
        <span className={`${iotPrefix}-simple-pagination-page-label`} maxpage={maxPage}>
          {typeof totalItemsText === 'function'
            ? totalItemsText(totalItems)
            : typeof mergedI18n.totalItemsText === 'function'
            ? mergedI18n.totalItemsText(totalItems)
            : `${totalItems} ${mergedI18n.totalItemsText}`}
        </span>
      ) : null}
      <div className={`${iotPrefix}-simple-pagination-page-bar`}>
        <span className={`${iotPrefix}-simple-pagination-page-label`} maxpage={maxPage}>
          {mergedI18n.pageText
            ? `${mergedI18n.pageText} ${page}`
            : pageOfPagesText?.(page, maxPage) ?? mergedI18n.pageOfPagesText(page, maxPage)}
        </span>
        {maxPage > 1 ? (
          <>
            <div
              className={
                hasPrev
                  ? `${prefix}--pagination__button ${prefix}--pagination__button--backward ${iotPrefix}-addons-simple-pagination-button`
                  : `${prefix}--pagination__button ${prefix}--pagination__button--backward ${iotPrefix}-addons-simple-pagination-button-disabled`
              }
              role="button"
              tabIndex={hasPrev ? 0 : -1}
              onClick={hasPrev ? handlePrev : undefined}
              onKeyDown={hasPrev ? (evt) => handleEnterKeyDown(evt, handlePrev) : undefined}
              data-testid={`${testID || testId}-backward-button`}
            >
              <CaretLeft16
                dir="ltr"
                aria-label={mergedI18n.prevPageText}
                className={
                  hasPrev
                    ? `${iotPrefix}-simple-pagination-caret`
                    : `${iotPrefix}-simple-pagination-caret-disabled`
                }
              />
            </div>
            <div
              className={
                hasNext
                  ? `${prefix}--pagination__button ${prefix}--pagination__button--forward ${iotPrefix}-addons-simple-pagination-button`
                  : `${prefix}--pagination__button ${prefix}--pagination__button--forward ${iotPrefix}-addons-simple-pagination-button-disabled`
              }
              role="button"
              tabIndex={hasNext ? 0 : -1}
              onClick={hasNext ? handleNext : undefined}
              onKeyDown={hasNext ? (evt) => handleEnterKeyDown(evt, handleNext) : undefined}
              data-testid={`${testID || testId}-forward-button`}
            >
              <CaretRight16
                dir="ltr"
                aria-label={mergedI18n.nextPageText}
                className={
                  hasNext
                    ? `${iotPrefix}-simple-pagination-caret`
                    : `${iotPrefix}-simple-pagination-caret-disabled`
                }
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

SimplePagination.propTypes = SimplePaginationPropTypes;
SimplePagination.defaultProps = defaultProps;

export default SimplePagination;
