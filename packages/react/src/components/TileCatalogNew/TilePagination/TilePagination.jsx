import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { settings } from '../../../constants/Settings';

const { prefix } = settings;

const propTypes = {
  /** current page number */
  page: PropTypes.number.isRequired,
  /** total number of pages */
  numPages: PropTypes.number.isRequired,
  /** call back function receive current page number */
  onChange: PropTypes.func.isRequired,
  /** i18n strings */
  i18n: PropTypes.shape({
    ariaLabelPreviousPage: PropTypes.string,
    ariaLabelNextPage: PropTypes.string,
    ariaLabelPagination: PropTypes.string,
    ariaLabelPage: PropTypes.string,
    ariaLabelSelect: PropTypes.string,
  }),
  testId: PropTypes.string,
};

const defaultProps = {
  i18n: {
    ariaLabelPreviousPage: 'Previous page',
    ariaLabelNextPage: 'Next page',
    ariaLabelPagination: 'pagination',
    ariaLabelPage: 'page',
    ariaLabelSelect: 'select page number',
  },
  testId: 'tile-pagination',
};

const TilePagination = ({ page, numPages, onChange, i18n, testId }) => {
  const [selectedValue, setSelectedValue] = useState();

  const getPageButton = (pageNumber) => (
    <button
      type="button"
      onClick={() => onChange(pageNumber)}
      className={classnames(`${prefix}--pagination-nav__page`, {
        [`${prefix}--pagination-nav__page--active`]: page === pageNumber,
        [`${prefix}--pagination-nav__page--disabled`]: page === pageNumber,
      })}
      aria-current={i18n.ariaLabelPage}
      aria-disabled={page === pageNumber}
      data-testid={`${testId}-page-${pageNumber}-button`}
    >
      <span className={`${prefix}--pagination-nav__accessibility-label`}>{i18n.ariaLabelPage}</span>
      {pageNumber}
    </button>
  );

  const getPageSelect = (pageNumber, accumulator) => (
    <li className={`${prefix}--pagination-nav__list-item`}>
      <div className={`${prefix}--pagination-nav__select`}>
        <select
          className={`${prefix}--pagination-nav__page ${prefix}--pagination-nav__page--select`}
          data-page-select
          value={selectedValue}
          aria-label={i18n.ariaLabelSelect}
          onChange={(evt) => {
            onChange(Number(evt.target.value));
            setSelectedValue('default');
          }}
          data-testid={`${testId}-page-select`}
        >
          <option value="default" hidden data-page="" />
          {Array.from({ length: pageNumber }, (v, i) => (
            <option
              key={`TilePagination-option-${i + accumulator}`}
              value={i + accumulator}
              data-page={i + accumulator}
            >
              {i + accumulator}
            </option>
          ))}
        </select>
        <div className={`${prefix}--pagination-nav__select-icon-wrapper`}>
          <svg
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            className={`${prefix}--pagination-nav__select-icon`}
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
        <li
          key={`TilePagination-page-number-button-${i + 2}`}
          className={`${prefix}--pagination-nav__list-item`}
        >
          {getPageButton(i + 2)}
        </li>
      ));
    }
    if (!showFrontOverFlowMenu && showBackOverFlowMenu) {
      buttons = Array.from({ length: 4 }, (v, i) => (
        <li
          key={`TilePagination-page-number-button-${i + 2}`}
          className={`${prefix}--pagination-nav__list-item`}
        >
          {getPageButton(i + 2)}
        </li>
      ));
    }
    if (showFrontOverFlowMenu && showBackOverFlowMenu) {
      buttons = [
        <li
          key={`TilePagination-page-number-button-${page - 1}`}
          className={`${prefix}--pagination-nav__list-item`}
        >
          {getPageButton(page - 1)}
        </li>,
        <li
          key={`TilePagination-page-number-button-${page}`}
          className={`${prefix}--pagination-nav__list-item`}
        >
          {getPageButton(page)}
        </li>,
        <li
          key={`TilePagination-page-number-button-${page + 1}`}
          className={`${prefix}--pagination-nav__list-item`}
        >
          {getPageButton(page + 1)}
        </li>,
      ];
    }
    if (showFrontOverFlowMenu && !showBackOverFlowMenu) {
      buttons = [
        <li
          key={`TilePagination-page-number-button-${numPages - 4}`}
          className={`${prefix}--pagination-nav__list-item`}
        >
          {getPageButton(numPages - 4)}
        </li>,
        <li
          key={`TilePagination-page-number-button-${numPages - 3}`}
          className={`${prefix}--pagination-nav__list-item`}
        >
          {getPageButton(numPages - 3)}
        </li>,
        <li
          key={`TilePagination-page-number-button-${numPages - 2}`}
          className={`${prefix}--pagination-nav__list-item`}
        >
          {getPageButton(numPages - 2)}
        </li>,
        <li
          key={`TilePagination-page-number-button-${numPages - 1}`}
          className={`${prefix}--pagination-nav__list-item`}
        >
          {getPageButton(numPages - 1)}
        </li>,
      ];
    }

    return buttons;
  };

  const getFrontOverFlowMenu = () => {
    return showBackOverFlowMenu ? getPageSelect(page - 3, 2) : getPageSelect(numPages - 6, 2);
  };

  const getBackOverFlowMenu = () => {
    return showFrontOverFlowMenu
      ? getPageSelect(numPages - page - 2, page + 2)
      : getPageSelect(numPages - 6, 6);
  };

  return (
    <nav className={`${prefix}--pagination-nav`} aria-label={i18n.ariaLabelPagination}>
      <ul className={`${prefix}--pagination-nav__list`}>
        <li className={`${prefix}--pagination-nav__list-item`}>
          <button
            type="button"
            onClick={() => page > 1 && onChange(page - 1)}
            className={classnames(
              `${prefix}--pagination-nav__page`,
              `${prefix}--pagination-nav__page--direction`,
              {
                [`${prefix}--pagination-nav__page--disabled`]: page === 1,
              }
            )}
            aria-disabled="true"
            data-testid={`${testId}-backward-button`}
          >
            <span className={`${prefix}--pagination-nav__accessibility-label`}>
              {i18n.ariaLabelPreviousPage}
            </span>
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              style={{ willChange: 'transform' }}
              xmlns="http://www.w3.org/2000/svg"
              className={`${prefix}--pagination-nav__icon`}
              width="5"
              height="8"
              viewBox="0 0 5 8"
              aria-hidden="true"
            >
              <path d="M5 8L0 4 5 0z" />
            </svg>
          </button>
        </li>
        <li className={`${prefix}--pagination-nav__list-item`}>{getPageButton(1)}</li>

        {showFrontOverFlowMenu ? getFrontOverFlowMenu() : null}

        {getPageNumberButtons()}

        {showBackOverFlowMenu ? getBackOverFlowMenu() : null}

        {numPages > 1 ? (
          <li className={`${prefix}--pagination-nav__list-item`}>{getPageButton(numPages)}</li>
        ) : null}
        <li className={`${prefix}--pagination-nav__list-item`}>
          <button
            type="button"
            onClick={() => page < numPages && onChange(page + 1)}
            className={classnames(
              `${prefix}--pagination-nav__page`,
              `${prefix}--pagination-nav__page--direction`,
              {
                [`${prefix}--pagination-nav__page--disabled`]: page === numPages,
              }
            )}
            data-testid={`${testId}-foreward-button`}
          >
            <span className={`${prefix}--pagination-nav__accessibility-label`}>
              {i18n.ariaLabelNextPage}
            </span>
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              style={{ willChange: 'transform' }}
              xmlns="http://www.w3.org/2000/svg"
              className={`${prefix}--pagination-nav__icon`}
              width="5"
              height="8"
              viewBox="0 0 5 8"
              aria-hidden="true"
            >
              <path d="M0 0L5 4 0 8z" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

TilePagination.propTypes = propTypes;
TilePagination.defaultProps = defaultProps;

export default TilePagination;
