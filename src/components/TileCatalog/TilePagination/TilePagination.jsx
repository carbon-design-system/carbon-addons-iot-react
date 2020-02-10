import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const propTypes = {
  page: PropTypes.number.isRequired,
  numPages: PropTypes.number.isRequired,
  onChange: PropTypes.number.isRequired,
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
  return (
    <nav className="bx--pagination-nav" ariaLabel={i18n.ariaLabelPagination}>
      <ul className="bx--pagination-nav__list">
        <li className="bx--pagination-nav__list-item">{prevButton}</li>
        {Array.from({ length: numPages }, (v, i) => (
          <li className="bx--pagination-nav__list-item">{getPageButton(i + 1)}</li>
        ))}
        <li className="bx--pagination-nav__list-item">{nextButton}</li>
      </ul>
    </nav>
  );
};

TilePagination.propTypes = propTypes;
TilePagination.defaultProps = defaultProps;

export default TilePagination;
