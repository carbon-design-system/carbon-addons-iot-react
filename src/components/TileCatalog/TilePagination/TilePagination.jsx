import React from 'react';

const TilePagination = () => {
  return (
    <nav className="bx--pagination-nav" aria-label="pagination" data-pagination-nav>
      <ul className="bx--pagination-nav__list">
        <li className="bx--pagination-nav__list-item">
          <button
            className="bx--pagination-nav__page bx--pagination-nav__page--direction "
            data-page-previous
          >
            <span className="bx--pagination-nav__accessibility-label">Previous page </span>
          </button>
        </li>
        <li className="bx--pagination-nav__list-item">
          <button className="bx--pagination-nav__page" data-page="1" data-page-button>
            <span className="bx--pagination-nav__accessibility-label">page </span>1
          </button>
        </li>
        <li className="bx--pagination-nav__list-item">
          <button className="bx--pagination-nav__page" data-page="2" data-page-button>
            <span className="bx--pagination-nav__accessibility-label">page </span>2
          </button>
        </li>
        <li className="bx--pagination-nav__list-item">
          <button
            className="bx--pagination-nav__page bx--pagination-nav__page--active bx--pagination-nav__page--disabled"
            data-page="3"
            data-page-button
            data-page-active="true"
            aria-current="page"
            aria-disabled="true"
          >
            <span className="bx--pagination-nav__accessibility-label">page </span>3
          </button>
        </li>
        <li className="bx--pagination-nav__list-item">
          <button className="bx--pagination-nav__page" data-page="4" data-page-button>
            <span className="bx--pagination-nav__accessibility-label">page </span>4
          </button>
        </li>
        <li className="bx--pagination-nav__list-item">
          <button className="bx--pagination-nav__page" data-page="5" data-page-button>
            <span className="bx--pagination-nav__accessibility-label">page </span>5
          </button>
        </li>
        <li className="bx--pagination-nav__list-item">
          <div className="bx--pagination-nav__select">
            <select
              className="bx--pagination-nav__page bx--pagination-nav__page--select"
              data-page-select
              aria-label="select page number"
            >
              <option value="" hidden />
              <option value="6" data-page="6">
                6
              </option>
              <option value="7" data-page="7">
                7
              </option>
              <option value="8" data-page="8">
                8
              </option>
              <option value="9" data-page="9">
                9
              </option>
            </select>
            <div className="bx--pagination-nav__select-icon-wrapper" />
          </div>
        </li>
        <li className="bx--pagination-nav__list-item">
          <button className="bx--pagination-nav__page" data-page="10" data-page-button>
            <span className="bx--pagination-nav__accessibility-label">page </span>10
          </button>
        </li>
        <li className="bx--pagination-nav__list-item">
          <button
            className="bx--pagination-nav__page bx--pagination-nav__page--direction"
            data-page-next
          >
            <span className="bx--pagination-nav__accessibility-label">Next page </span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default TilePagination;
