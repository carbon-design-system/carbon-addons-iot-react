import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import escapeRegExp from 'lodash/escapeRegExp';
import { ButtonTypes } from 'carbon-components-react/lib/prop-types/types';

import PageTitleBar from '../PageTitleBar';
import Button from '../Button';

import TileGallery from './TileGallery';
import TileGallerySection from './TileGallerySection';
import TileGalleryItem from './TileGalleryItem';
import TileGallerySearch from './TileGallerySearch';
import TileGalleryViewSwitcher from './TileGalleryViewSwitcher';

const propTypes = {
  /** Title of the page  */
  title: PropTypes.string.isRequired,
  /** Details about what the page shows */
  description: PropTypes.node,
  /** Has simple search capability */
  hasSearch: PropTypes.bool,
  /** Has toggle grid/list component */
  hasSwitcher: PropTypes.bool,
  /** Has button */
  hasButton: PropTypes.bool,
  /** i18n strings */
  i18n: PropTypes.shape({
    /** i18n strings for seach capability */
    searchIconDescription: PropTypes.string,
    searchPlaceHolderText: PropTypes.string,
    searchCloseButtonText: PropTypes.string,
    /** i18n strings for grid/list capability */
    listText: PropTypes.string,
    gridText: PropTypes.string,
    descriptionMoreInfo: PropTypes.string,
    arrowIconDescription: PropTypes.string,
  }),
  /** Custom className for component */
  className: PropTypes.string,
  galleryData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      sectionTitle: PropTypes.string,
      galleryItems: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          description: PropTypes.string,
          moreInfoLink: PropTypes.string,
          icon: PropTypes.node,
          afterContent: PropTypes.node,
          thumbnail: PropTypes.node,
          href: PropTypes.string,
        })
      ),
    })
  ).isRequired,
  classNameGalleryItem: PropTypes.string,
  /** Is button disabled */
  isButtonDisabled: PropTypes.bool,
  /** Custom className for Button component */
  buttonClassName: PropTypes.string,
  /** Button kind */
  buttonKind: ButtonTypes.buttonKind,
  /** Button content */
  buttonText: PropTypes.string,
};

const defaultProps = {
  description: null,
  hasSearch: false,
  hasSwitcher: false,
  hasButton: false,
  i18n: {
    searchIconDescription: 'Search',
    searchPlaceHolderText: 'Search for something',
    searchCloseButtonText: 'Clear search',
    listText: 'List',
    gridText: 'Grid',
    arrowIconDescription: 'Expand/Collapse',
  },
  className: null,
  classNameGalleryItem: null,
  isButtonDisabled: false,
  buttonClassName: null,
  buttonKind: 'primary',
  buttonText: null,
};

const doesGalleryItemMatch = (galleryItem, searchString) => {
  const searchRegexp = new RegExp(escapeRegExp(searchString) || '', 'i');
  return searchRegexp.test(galleryItem.title) || searchRegexp.test(galleryItem.description);
};

const StatefulTileGallery = ({
  title,
  description,
  hasSearch,
  hasSwitcher,
  hasButton,
  i18n,
  className,
  galleryData,
  classNameGalleryItem,
  isButtonDisabled,
  buttonClassName,
  buttonKind,
  buttonText,
}) => {
  const [search, setSearch] = useState();
  const [thumbnails, setThumbnails] = useState(true);

  return (
    <PageTitleBar
      title={title}
      description={description}
      className={className}
      extraContent={
        <div style={{ display: 'flex' }}>
          {hasSearch ? (
            <TileGallerySearch
              searchValue={search}
              onChange={event => setSearch(get(event, 'currentTarget.value'))}
              width="305px"
              i18n={{
                iconDescription: i18n.searchIconDescription,
                placeHolderText: i18n.searchPlaceHolderText,
                closeButtonText: i18n.searchBloseButtonText,
              }}
            />
          ) : null}
          {hasSwitcher ? (
            <TileGalleryViewSwitcher
              onChange={event => setThumbnails(get(event, 'name') !== 'list')}
              selectedIndex={thumbnails ? 1 : 0}
              i18n={i18n}
            />
          ) : null}
          {hasButton ? (
            <Button disabled={isButtonDisabled} className={buttonClassName} kind={buttonKind}>
              {buttonText}
            </Button>
          ) : null}
        </div>
      }
      content={
        <TileGallery>
          {galleryData.map(item => {
            const items = item.galleryItems.filter(galleryItem =>
              doesGalleryItemMatch(galleryItem, search)
            );
            return (
              <TileGallerySection key={item.id} title={item.sectionTitle} i18n={i18n}>
                {items.map(galleryItem => {
                  return (
                    <TileGalleryItem
                      key={`item-${galleryItem.title}-${Math.random()}`}
                      className={classNameGalleryItem}
                      mode={thumbnails ? 'grid' : 'list'}
                      title={galleryItem.title}
                      description={galleryItem.description}
                      moreInfoLink={galleryItem.moreInfoLink}
                      icon={galleryItem.icon}
                      afterContent={galleryItem.afterContent}
                      thumbnail={galleryItem.thumbnail}
                      href={galleryItem.href}
                    />
                  );
                })}
              </TileGallerySection>
            );
          })}
        </TileGallery>
      }
    />
  );
};

StatefulTileGallery.propTypes = propTypes;
StatefulTileGallery.defaultProps = defaultProps;

export default StatefulTileGallery;
