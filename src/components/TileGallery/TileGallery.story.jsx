/* Used dependencies */
import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import {
  CheckmarkFilled16,
  Rocket32,
  StarFilled16,
  Activity32,
  Sunny32,
} from '@carbon/icons-react';
// import { green40 } from '@carbon/colors';
import { spacing07 } from '@carbon/layout';

import {
  TileGallery,
  TileGallerySection,
  TileGalleryItem,
  TileGalleryViewSwitcher,
  StatefulTileGallery,
  OverflowMenu,
  OverflowMenuItem,
} from '../../index';
import FullWidthWrapper from '../../internal/FullWidthWrapper';

const overflowComponent = (
  <OverflowMenu onClick={evt => evt.preventDefault()} style={{ height: spacing07 }}>
    <OverflowMenuItem itemText="Edit" onClick={action('Edit')} />
    <OverflowMenuItem itemText="Share" onClick={action('Share')} />
    <OverflowMenuItem itemText="Move" onClick={action('Move')} />
    <OverflowMenuItem itemText="Delete" onClick={action('Delete')} />
  </OverflowMenu>
);

export const content = (
  <Fragment>
    <TileGallerySection
      title={select('Select with/without section', { Title: 'Section 1', None: null }, 'Title')}
    >
      <TileGalleryItem
        title="Card title"
        description="card description"
        moreInfoLink="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
        mode="grid"
        thumbnail={<Rocket32 fill="black" description="Icon" width={50} height={50} />}
        icon={<CheckmarkFilled16 fill="#40be65" onClick={action('clicked')} />}
        afterContent={overflowComponent}
      />
      <TileGalleryItem
        title="Card title"
        description="card description"
        moreInfoLink="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
        mode="grid"
        thumbnail={<Activity32 fill="black" description="Icon" width={50} height={50} />}
        icon={<CheckmarkFilled16 fill="#40be65" onClick={action('clicked')} />}
        afterContent={overflowComponent}
      />
      <TileGalleryItem
        title="Card title"
        description="card description"
        moreInfoLink="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
        mode="grid"
        thumbnail={<Sunny32 fill="black" description="Icon" width={50} height={50} />}
        icon={<CheckmarkFilled16 fill="#40be65" onClick={action('clicked')} />}
        afterContent={overflowComponent}
      />
    </TileGallerySection>
    <TileGallerySection title="More">
      <TileGalleryItem
        title="Card title"
        description="card description"
        moreInfoLink="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
        mode="grid"
        thumbnail={<Sunny32 fill="black" description="Icon" width={50} height={50} />}
        icon={<CheckmarkFilled16 fill="#40be65" onClick={action('clicked')} />}
        afterContent={overflowComponent}
      />
    </TileGallerySection>
  </Fragment>
);

export const galleryData = [
  {
    id: 'id1',
    sectionTitle: 'Favorites',
    galleryItems: [
      {
        title: 'Dashboard title',
        description: 'More about your dashboard',
        icon: <StarFilled16 />,
        afterContent: overflowComponent,
        thumbnail: <Activity32 />,
        onClick: action('Card Clicked'),
      },
      {
        title: 'Health',
        description: 'More about your dashboard',
        icon: <StarFilled16 />,
        afterContent: overflowComponent,
        thumbnail: <Sunny32 />,
        onClick: action('Card Clicked'),
      },
      {
        title: 'Activity',
        description: 'More about your dashboard',
        icon: <StarFilled16 />,
        afterContent: overflowComponent,
        thumbnail: <Activity32 />,
        onClick: action('Card Clicked'),
      },
    ],
  },
  {
    id: 'id2',
    sectionTitle: 'Dashboard Category A',
    galleryItems: [
      {
        title: 'Dashboard title',
        description: 'More about your dashboard',
        icon: <StarFilled16 />,
        afterContent: overflowComponent,
        thumbnail: <Activity32 />,
        onClick: action('Card Clicked'),
      },
      {
        title: 'Dashboard title',
        description: 'More about your dashboard',
        icon: <StarFilled16 />,
        afterContent: overflowComponent,
        thumbnail: <Sunny32 />,
        onClick: action('Card Clicked'),
      },
      {
        title: 'Dashboard title',
        description: 'More about your dashboard',
        icon: <StarFilled16 />,
        afterContent: overflowComponent,
        thumbnail: <Activity32 />,
        onClick: action('Card Clicked'),
      },
    ],
  },
];

storiesOf('Watson IoT Experimental|TileGallery', module)
  .addDecorator(storyFn => <FullWidthWrapper>{storyFn()}</FullWidthWrapper>)

  .add('Stateful TileGallery', () => (
    <StatefulTileGallery
      title="Dashboard"
      hasSearch
      hasSwitcher
      hasButton
      buttonText="Create +"
      galleryData={galleryData}
    />
  ))
  .add('basic example ', () => (
    <div style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 }}>
      <TileGallery>{content}</TileGallery>
    </div>
  ))
  .add('TileGalleryItem - Grid', () => (
    <TileGalleryItem
      title="Card title"
      description="card description"
      moreInfoLink="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
      mode="grid"
      thumbnail={<Rocket32 fill="black" description="Icon" width={50} height={50} />}
      icon={<CheckmarkFilled16 fill="#40be65" onClick={action('Icon Clicked')} />}
      afterContent={overflowComponent}
      onClick={action('Card Clicked')}
      className="not-active"
    />
  ))
  .add('TileGalleryItem - List', () => (
    <TileGalleryItem
      title="Test"
      description="The first one"
      mode="list"
      icon={<StarFilled16 fill="black" onClick={action('Icon clicked')} />}
      afterContent={overflowComponent}
      onClick={action('Card Clicked')}
    />
  ))
  .add('TileGalleryViewSwitcher', () => <TileGalleryViewSwitcher />)
  .add('TileGallerySection with TileGalleryItem Grid', () => (
    <div style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 }}>{content}</div>
  ))
  .add('TileGallerySection with TileGalleryItem - i18n', () => (
    <StatefulTileGallery
      title={text('title', '__Dashboard__')}
      hasSearch
      hasSwitcher
      hasButton
      buttonText={text('button', '__Create__')}
      galleryData={[
        {
          id: 'id1',
          sectionTitle: text('sectionTitle', '__Favorites__'),
          galleryItems: [
            {
              title: text('title', '__Dashboard title__'),
              description: text('description', '__More about your dashboard__'),
              icon: <StarFilled16 />,
              afterContent: (
                <OverflowMenu
                  onClick={evt => evt.preventDefault()}
                  style={{ height: spacing07 }}
                  iconDescription={text('icon description', '__icon description__')}
                >
                  <OverflowMenuItem itemText={text('Edit', '__Edit__')} onClick={action('Edit')} />
                  <OverflowMenuItem
                    itemText={text('Share', '__Share__')}
                    onClick={action('Share')}
                  />
                  <OverflowMenuItem itemText={text('Move', '__Move__')} onClick={action('Move')} />
                  <OverflowMenuItem
                    itemText={text('Delete', '__Delete__')}
                    onClick={action('Deleted')}
                  />
                </OverflowMenu>
              ),
              thumbnail: <Activity32 />,
              onClick: action('Card Clicked'),
            },
          ],
        },
      ]}
      i18n={{
        searchIconDescription: text('i18n.searchIconDescription', '__Search Icon Description__'),
        searchPlaceHolderText: text('i18n.searchPlaceHolderText', '__Search Placeholder__'),
        searchCloseButtonText: text('i18n.searchCloseButtonText', '__Search Close Button__'),
        listText: text('i18n.listText', '__ListText__'),
        gridText: text('i18n.gridText', '__GridText__'),
        descriptionMoreInfo: text('i18n.descriptionMoreInfo', '__DescriptionMoreInfo__'),
        arrowIconDescription: text('i18n.arrowIconDescription', '__Expand/Collapse__'),
      }}
    />
  ));
