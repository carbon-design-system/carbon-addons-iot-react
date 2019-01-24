import React from 'react';
import PropTypes from 'prop-types';

import { defaultFunction } from '../../../utils/componentUtilityFunctions';

const propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onChangePage: PropTypes.func,
  onChangeItemsPerPage: PropTypes.func,
};

const defaultProps = {
  onChangePage: defaultFunction,
  onChangeItemsPerPage: defaultFunction,
};

const Pagination = ({ totalItems, itemsPerPage, page, onChangePage, onChangeItemsPerPage }) => {
  const minItemInView = (page - 1) * itemsPerPage + 1;
  const maxItemInView = page * itemsPerPage;
  const minPage = 1;
  const maxPage = Math.ceil(totalItems / itemsPerPage);
  return (
    <div className="bx--pagination" data-pagination>
      <div className="bx--pagination__left">
        <span className="bx--pagination__text">Items per page:</span>
        <div className="bx--select bx--select--inline">
          <select
            onChange={evt => onChangeItemsPerPage(evt.target.value)}
            className="bx--select-input"
            data-items-per-page>
            {[10, 20, 30, 40, 50].map(i => (
              <option key={i} className="bx--select-option" value={i} selected={itemsPerPage === i}>
                {i}
              </option>
            ))}
          </select>
          <svg className="bx--select__arrow" width="10" height="5" viewBox="0 0 10 5">
            <path d="M0 0l5 4.998L10 0z" fillRule="evenodd" />
          </svg>
        </div>
        <span className="bx--pagination__text">
          <span>|&nbsp;</span>
          <span data-displayed-item-range>{`${minItemInView}-${maxItemInView}`}</span>
          &nbsp;of&nbsp;
          <span data-total-items>{totalItems}</span>
          &nbsp;items
        </span>
      </div>
      <div className="bx--pagination__right bx--pagination--inline">
        <span className="bx--pagination__text">
          <span data-displayed-page-number>{page}</span>
          &nbsp;of&nbsp;
          <span data-total-pages>{maxPage}</span>
          &nbsp;pages
        </span>
        <button
          type="button"
          onClick={() => onChangePage(page - 1)}
          disabled={page === minPage}
          className="bx--pagination__button bx--pagination__button--backward"
          data-page-backward
          aria-label="Backward button">
          <svg className="bx--pagination__button-icon" width="7" height="12" viewBox="0 0 7 12">
            <path fillRule="nonzero" d="M1.45 6.002L7 11.27l-.685.726L0 6.003 6.315 0 7 .726z" />
          </svg>
        </button>
        <div className="bx--select bx--select--inline">
          <select className="bx--select-input" data-page-number-input>
            {[...Array(maxPage - 1).keys()].map(i => (
              <option key={i} className="bx--select-option" value={i + 1} selected={page === i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <svg className="bx--select__arrow" width="10" height="5" viewBox="0 0 10 5">
            <path d="M0 0l5 4.998L10 0z" fillRule="evenodd" />
          </svg>
        </div>
        <button
          type="button"
          onClick={() => onChangePage(page + 1)}
          disabled={page === maxPage}
          className="bx--pagination__button bx--pagination__button--forward"
          data-page-forward
          aria-label="Forward button">
          <svg className="bx--pagination__button-icon" width="7" height="12" viewBox="0 0 7 12">
            <path
              fillRule="nonzero"
              d="M5.569 5.994L0 .726.687 0l6.336 5.994-6.335 6.002L0 11.27z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;

export default Pagination;
