import React from 'react';
import PropTypes from 'prop-types';

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
  }),
  /** Custom className for component */
  className: PropTypes.string,
  galleryData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      sectionTitle: PropTypes.string,
      galleryItem: PropTypes.arrayOf(
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
};

const defaultProps = {
  description: null,
  hasSearch: false,
  hasSwitcher: false,
  i18n: {
    searchIconDescription: 'Search',
    searchPlaceHolderText: 'Search for something',
    searchCloseButtonText: 'Clear search',
    listText: 'List',
    gridText: 'Grid',
  },
  className: null,
  classNameGalleryItem: null,
};

const StatefulTileGallery = ({
  title,
  description,
  hasSearch,
  i18n,
  className,
  hasSwitcher,
  galleryData,
  classNameGalleryItem,
}) => {
  return (
    <PageTitleBar
      title={title}
      description={description}
      className={className}
      extraContent={
        <div style={{ display: 'flex' }}>
          {hasSearch ? (
            <TileGallerySearch
              style={{ backgroundColor: 'blue' }}
              searchValue=""
              onChange={() => {}}
              width="305px"
              i18n={{
                iconDescription: i18n.searchIconDescription,
                placeHolderText: i18n.searchPlaceHolderText,
                closeButtonText: i18n.searchBloseButtonText,
              }}
            />
          ) : null}
          {hasSwitcher ? (
            <TileGalleryViewSwitcher onChange={() => {}} selectedIndex={0} i18n={i18n} />
          ) : null}
          <Button />
        </div>
      }
      content={
        <TileGallery>
          {galleryData.map(item => {
            return (
              <TileGallerySection key={item.id} title={item.sectionTitle}>
                <TileGalleryItem className={classNameGalleryItem} />
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
