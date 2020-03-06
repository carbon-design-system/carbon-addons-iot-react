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
  const getPageSelect = pageNumber => (
    <li className="bx--pagination-nav__list-item">
      <div className="bx--pagination-nav__select">
        <select
          className="bx--pagination-nav__page bx--pagination-nav__page--select"
          data-page-select
          aria-label="select page number"
        >
          <option value="" hidden data-page="" />
          {Array.from({ length: pageNumber }, (v, i) => (
            <option value={i + 5} data-page={i + 5}>
              {i + 5}
            </option>
          ))}
        </select>
        <div className="bx--pagination-nav__select-icon-wrapper">
          <svg
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            class="bx--pagination-nav__select-icon"
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
  return (
    <nav className="bx--pagination-nav" ariaLabel={i18n.ariaLabelPagination}>
      <ul className="bx--pagination-nav__list">
        <li className="bx--pagination-nav__list-item">{prevButton}</li>
        {numPages < 5
          ? Array.from({ length: numPages - 1 }, (v, i) => (
              <li className="bx--pagination-nav__list-item">{getPageButton(i + 1)}</li>
            ))
          : Array.from({ length: 4 }, (v, i) => (
              <li className="bx--pagination-nav__list-item">{getPageButton(i + 1)}</li>
            ))}
        {numPages > 5 ? getPageSelect(numPages - 5) : null}
        <li className="bx--pagination-nav__list-item">{getPageButton(numPages)}</li>
        <li className="bx--pagination-nav__list-item">{nextButton}</li>
      </ul>
    </nav>
  );
};

TilePagination.propTypes = propTypes;
TilePagination.defaultProps = defaultProps;

export default TilePagination;
