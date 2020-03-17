import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const propTypes = {
  /** current page number */
  page: PropTypes.number.isRequired,
  /** total number of pages */
  numPages: PropTypes.number.isRequired,
  /** call back function receive current page number */
  onChange: PropTypes.number.isRequired,
  /** i18n strings */
  i18n: PropTypes.shape({}),
};
const defaultProps = {
  i18n: {
    ariaLabelPreviousPage: 'Previous page',
    ariaLabelNextPage: 'Next page',
    ariaLabelPagination: 'pagination',
    ariaLabelPage: 'page',
  },
};

const TilePagination = ({ page, numPages, onChange, i18n }) => {
  const prevButton = (
    <button
      type="button"
      onClick={() => page > 1 && onChange(page - 1)}
      className={classnames('bx--pagination-nav__page', 'bx--pagination-nav__page--direction', {
        'bx--pagination-nav__page--disabled': page === 1,
      })}
      ariaDisabled="true"
    >
      <span className="bx--pagination-nav__accessibility-label">{i18n.ariaLabelPreviousPage}</span>
      <svg
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        style={{ 'will-change': 'transform' }}
        xmlns="http://www.w3.org/2000/svg"
        className="bx--pagination-nav__icon"
        width="5"
        height="8"
        viewBox="0 0 5 8"
        ariaHidden="true"
      >
        <path d="M5 8L0 4 5 0z" />
      </svg>
    </button>
  );
  const nextButton = (
    <button
      type="button"
      onClick={() => page < numPages && onChange(page + 1)}
      className={classnames('bx--pagination-nav__page', 'bx--pagination-nav__page--direction', {
        'bx--pagination-nav__page--disabled': page === numPages,
      })}
    >
      <span className="bx--pagination-nav__accessibility-label">{i18n.ariaLabelNextPage}</span>
      <svg
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        style={{ 'will-change': 'transform' }}
        xmlns="http://www.w3.org/2000/svg"
        className="bx--pagination-nav__icon"
        width="5"
        height="8"
        viewBox="0 0 5 8"
        ariaHidden="true"
      >
        <path d="M0 0L5 4 0 8z" />
      </svg>
    </button>
  );
  const getPageButton = pageNumber => (
    <button
      type="button"
      onClick={() => onChange(pageNumber)}
      className={classnames('bx--pagination-nav__page', {
        'bx--pagination-nav__page--active': page === pageNumber,
        'bx--pagination-nav__page--disabled': page === pageNumber,
      })}
      ariaCurrent={i18n.ariaLabelPage}
      ariaDisabled={page === pageNumber}
    >
      <span className="bx--pagination-nav__accessibility-label">{i18n.ariaLabelPage}</span>
      {pageNumber}
    </button>
  );
  const getPageSelect = (pageNumber, accumulator) => (
    <li className="bx--pagination-nav__list-item">
      <div className="bx--pagination-nav__select">
        <select
          className="bx--pagination-nav__page bx--pagination-nav__page--select"
          data-page-select
          aria-label="select page number"
          onChange={evt => onChange(Number(evt.target.value))}
        >
          <option value="default" hidden data-page="" />
          {Array.from({ length: pageNumber }, (v, i) => (
            <option value={i + accumulator} data-page={i + accumulator}>
              {i + accumulator}
            </option>
          ))}
        </select>
        <div className="bx--pagination-nav__select-icon-wrapper">
          <svg
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            className="bx--pagination-nav__select-icon"
            width="16"
            height="16"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <circle cx="8" cy="16" r="2" />
            <circle cx="16" cy="16" r="2" />
            <circle cx="24" cy="16" r="2" />
          </svg>
        </div>
      </div>
    </li>
  );

  // maximum of how many page buttons to show
  const maxPageButtonsToShow = 7;
  // how many page buttons to show from the beginning before move to overflow menu
  const frontThreshold = 4;
  // how many page buttons to show from the end before move to overflow menu
  const backThreshold = 4;

  const isLargeNumberOfButtons = numPages > maxPageButtonsToShow;
  // if page number in first 4 numbers, do not show front overflow menu
  const showFrontOverFlowMenu = isLargeNumberOfButtons && page > frontThreshold;
  // if page number in last 4 numbers, do not show back overflow menu
  const showBackOverFlowMenu = isLargeNumberOfButtons && page < numPages - backThreshold + 1;

  const getPageNumberButtons = () => {
    let buttons = [];
    if (!isLargeNumberOfButtons) {
      buttons = Array.from({ length: numPages - 2 }, (v, i) => (
        <li className="bx--pagination-nav__list-item">{getPageButton(i + 2)}</li>
      ));
    }
    if (!showFrontOverFlowMenu && showBackOverFlowMenu) {
      buttons = Array.from({ length: 4 }, (v, i) => (
        <li className="bx--pagination-nav__list-item">{getPageButton(i + 2)}</li>
      ));
    }
    if (showFrontOverFlowMenu && showBackOverFlowMenu) {
      buttons = [
        <li className="bx--pagination-nav__list-item">{getPageButton(page - 1)}</li>,
        <li className="bx--pagination-nav__list-item">{getPageButton(page)}</li>,
        <li className="bx--pagination-nav__list-item">{getPageButton(page + 1)}</li>,
      ];
    }
    if (showFrontOverFlowMenu && !showBackOverFlowMenu) {
      buttons = [
        <li className="bx--pagination-nav__list-item">{getPageButton(numPages - 4)}</li>,
        <li className="bx--pagination-nav__list-item">{getPageButton(numPages - 3)}</li>,
        <li className="bx--pagination-nav__list-item">{getPageButton(numPages - 2)}</li>,
        <li className="bx--pagination-nav__list-item">{getPageButton(numPages - 1)}</li>,
      ];
    }

    return buttons;
  };

  return (
    <nav className="bx--pagination-nav" ariaLabel={i18n.ariaLabelPagination}>
      <ul className="bx--pagination-nav__list">
        <li className="bx--pagination-nav__list-item">{prevButton}</li>
        <li className="bx--pagination-nav__list-item">{getPageButton(1)}</li>

        {showFrontOverFlowMenu ? getPageSelect(page - 3, 2) : null}

        {getPageNumberButtons()}

        {showBackOverFlowMenu && !showFrontOverFlowMenu ? getPageSelect(numPages - 6, 6) : null}

        {showBackOverFlowMenu && showFrontOverFlowMenu
          ? getPageSelect(numPages - page - 2, page + 2)
          : null}

        {numPages > 1 ? (
          <li className="bx--pagination-nav__list-item">{getPageButton(numPages)}</li>
        ) : null}
        <li className="bx--pagination-nav__list-item">{nextButton}</li>
      </ul>
    </nav>
  );
};

TilePagination.propTypes = propTypes;
TilePagination.defaultProps = defaultProps;

export default TilePagination;
