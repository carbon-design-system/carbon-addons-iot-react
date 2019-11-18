/* Used dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select } from '@storybook/addon-knobs';
import Check from '@carbon/icons-react/lib/checkmark--filled/16';
import Rocket from '@carbon/icons-react/lib/rocket/32';
import IconStarFav from '@carbon/icons-react/lib/star--filled/16';
import Activity from '@carbon/icons-react/lib/activity/32';
import Sunny from '@carbon/icons-react/lib/sunny/32';

import {
  PageTitleBar,
  TileGallery,
  TileGallerySection,
  TileGalleryItem,
  TileGalleryViewSwitcher,
  StatefulTileGallery,
  Link,
  OverflowMenu,
  OverflowMenuItem,
} from '../../index';
import FullWidthWrapper from '../../internal/FullWidthWrapper';

export const content = (
  <TileGallery>
    <TileGallerySection title="Section 1">
      <TileGalleryItem
        title="Card title"
        description="card description"
        moreInfoLink="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
        mode="grid"
        thumbnail={<Rocket fill="black" description="Icon" width={50} height={50} />}
        icon={<Check fill="#40be65" onClick={() => alert('favorite')} />}
        afterContent={
          <OverflowMenu
            floatingMenu
            onClick={evt => evt.preventDefault()}
            style={{ height: '2rem' }}
          >
            <OverflowMenuItem
              itemText="Set as home page"
              onClick={() => alert('Set as home page')}
            />
          </OverflowMenu>
        }
      />
      <TileGalleryItem
        title="Card title"
        description="card description"
        moreInfoLink="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
        mode="grid"
        thumbnail={<Activity fill="black" description="Icon" width={50} height={50} />}
        icon={<Check fill="#40be65" onClick={() => alert('favorite')} />}
        afterContent={
          <OverflowMenu
            floatingMenu
            onClick={evt => evt.preventDefault()}
            style={{ height: '2rem' }}
          >
            <OverflowMenuItem
              itemText="Set as home page"
              onClick={() => alert('Set as home page')}
            />
          </OverflowMenu>
        }
      />
      <TileGalleryItem
        title="Card title"
        description="card description"
        moreInfoLink="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
        mode="grid"
        thumbnail={<Sunny fill="black" description="Icon" width={50} height={50} />}
        icon={<Check fill="#40be65" onClick={() => alert('favorite')} />}
        afterContent={
          <OverflowMenu
            floatingMenu
            onClick={evt => evt.preventDefault()}
            style={{ height: '2rem' }}
          >
            <OverflowMenuItem
              itemText="Set as home page"
              onClick={() => alert('Set as home page')}
            />
          </OverflowMenu>
        }
      />
    </TileGallerySection>
    <TileGallerySection title="More">
      <TileGalleryItem
        title="Card title"
        description="card description"
        moreInfoLink="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
        mode="grid"
        thumbnail={<Sunny fill="black" description="Icon" width={50} height={50} />}
        icon={<Check fill="#40be65" onClick={() => alert('favorite')} />}
        afterContent={
          <OverflowMenu
            floatingMenu
            onClick={evt => evt.preventDefault()}
            style={{ height: '2rem' }}
          >
            <OverflowMenuItem
              itemText="Set as home page"
              onClick={() => alert('Set as home page')}
            />
          </OverflowMenu>
        }
      />
    </TileGallerySection>
  </TileGallery>
);

export const galleryData = [
  {
    id: 'id1',
    sectionTitle: 'Favorites',
    galleryItems: [
      {
        title: 'Dashboard title',
        description: 'More about your dashboard',
        icon: <IconStarFav />,
        afterContent: (
          <OverflowMenu
            floatingMenu
            onClick={evt => evt.preventDefault()}
            style={{ height: '2rem' }}
          >
            <OverflowMenuItem itemText="Edit" onClick={() => alert('Edit')} />
            <OverflowMenuItem itemText="Share" onClick={() => alert('Share')} />
            <OverflowMenuItem itemText="Move" onClick={() => alert('Move')} />
            <OverflowMenuItem itemText="Delete" onClick={() => alert('Delete')} />
          </OverflowMenu>
        ),
        thumbnail: <Activity />,
        href: 'www.ibm.com',
      },
      {
        title: 'Health',
        description: 'More about your dashboard',
        icon: <IconStarFav />,
        afterContent: (
          <OverflowMenu
            floatingMenu
            onClick={evt => evt.preventDefault()}
            style={{ height: '2rem' }}
          >
            <OverflowMenuItem itemText="Edit" onClick={() => alert('Edit')} />
            <OverflowMenuItem itemText="Share" onClick={() => alert('Share')} />
            <OverflowMenuItem itemText="Move" onClick={() => alert('Move')} />
            <OverflowMenuItem itemText="Delete" onClick={() => alert('Delete')} />
          </OverflowMenu>
        ),
        thumbnail: <Sunny />,
        href: 'www.ibm.com',
      },
      {
        title: 'Activity',
        description: 'More about your dashboard',
        icon: <IconStarFav />,
        afterContent: (
          <OverflowMenu
            floatingMenu
            onClick={evt => evt.preventDefault()}
            style={{ height: '2rem' }}
          >
            <OverflowMenuItem itemText="Edit" onClick={() => alert('Edit')} />
            <OverflowMenuItem itemText="Share" onClick={() => alert('Share')} />
            <OverflowMenuItem itemText="Move" onClick={() => alert('Move')} />
            <OverflowMenuItem itemText="Delete" onClick={() => alert('Delete')} />
          </OverflowMenu>
        ),
        thumbnail: <Activity />,
        href: 'www.ibm.com',
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
        icon: <IconStarFav />,
        afterContent: (
          <OverflowMenu
            floatingMenu
            onClick={evt => evt.preventDefault()}
            style={{ height: '2rem' }}
          >
            <OverflowMenuItem itemText="Edit" onClick={() => alert('Edit')} />
            <OverflowMenuItem itemText="Share" onClick={() => alert('Share')} />
            <OverflowMenuItem itemText="Move" onClick={() => alert('Move')} />
            <OverflowMenuItem itemText="Delete" onClick={() => alert('Delete')} />
          </OverflowMenu>
        ),
        thumbnail: <Activity />,
        href: 'www.ibm.com',
      },
      {
        title: 'Dashboard title',
        description: 'More about your dashboard',
        icon: <IconStarFav />,
        afterContent: (
          <OverflowMenu
            floatingMenu
            onClick={evt => evt.preventDefault()}
            style={{ height: '2rem' }}
          >
            <OverflowMenuItem itemText="Edit" onClick={() => alert('Edit')} />
            <OverflowMenuItem itemText="Share" onClick={() => alert('Share')} />
            <OverflowMenuItem itemText="Move" onClick={() => alert('Move')} />
            <OverflowMenuItem itemText="Delete" onClick={() => alert('Delete')} />
          </OverflowMenu>
        ),
        thumbnail: <Sunny />,
        href: 'www.ibm.com',
      },
      {
        title: 'Dashboard title',
        description: 'More about your dashboard',
        icon: <IconStarFav />,
        afterContent: (
          <OverflowMenu
            floatingMenu
            onClick={evt => evt.preventDefault()}
            style={{ height: '2rem' }}
          >
            <OverflowMenuItem itemText="Edit" onClick={() => alert('Edit')} />
            <OverflowMenuItem itemText="Share" onClick={() => alert('Share')} />
            <OverflowMenuItem itemText="Move" onClick={() => alert('Move')} />
            <OverflowMenuItem itemText="Delete" onClick={() => alert('Delete')} />
          </OverflowMenu>
        ),
        thumbnail: <Activity />,
        href: 'www.ibm.com',
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
  .add('basic example', () => (
    <div style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 }}>{content}</div>
  ))
  .add('wrapped in PageTitleBar', () => (
    <div style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 }}>
      <PageTitleBar
        title="A cool PageWizard!"
        description="The description from the PageTitleBar"
        breadcrumb={[
          <Link to="www.ibm.com">Home</Link>,
          <Link to="www.ibm.com">Something</Link>,
          <Link to="www.ibm.com">Something Else</Link>,
        ]}
        content={content}
      />
    </div>
  ))
  .add('TileGalleryItem - Grid', () => (
    <TileGalleryItem
      title="Card title"
      description="card description"
      moreInfoLink="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
      mode="grid"
      thumbnail={<Rocket fill="black" description="Icon" width={50} height={50} />}
      icon={<Check fill="#40be65" onClick={() => alert('favorite')} />}
      afterContent={
        <OverflowMenu floatingMenu onClick={evt => evt.preventDefault()} style={{ height: '2rem' }}>
          <OverflowMenuItem itemText="Set as home page" onClick={() => alert('Set as home page')} />
        </OverflowMenu>
      }
      href="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
      width={text('Card width', '305px')}
      height={text('Card height', '272px')}
      className="some-class"
    />
  ))
  .add('TileGalleryItem - List', () => (
    <TileGalleryItem
      title="Test"
      description="The first one"
      mode="list"
      icon={<IconStarFav fill="black" onClick={() => alert('favorite')} />}
      afterContent={
        <OverflowMenu floatingMenu onClick={evt => evt.preventDefault()} style={{ height: '2rem' }}>
          <OverflowMenuItem itemText="Set as home page" onClick={() => alert('Set as home page')} />
        </OverflowMenu>
      }
      width={text('Card width', '305px')}
    />
  ))
  .add('TileGalleryViewSwitcher', () => <TileGalleryViewSwitcher />)
  .add('TileGallerySection with TileGalleryItem Grid', () => (
    <TileGallerySection
      title={select('Select with/without section', { Title: 'Section 1', None: null }, 'Title')}
    >
      <TileGalleryItem
        title="Card title"
        description="Detailed description of this particular Solution could go here"
        moreInfoLink="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
        mode="grid"
        thumbnail={<Rocket fill="black" description="Icon" width={50} height={50} />}
        icon={<Check fill="#40be65" onClick={() => alert('favorite')} />}
        afterContent={
          <OverflowMenu
            floatingMenu
            onClick={evt => evt.preventDefault()}
            style={{ height: '2rem' }}
          >
            <OverflowMenuItem
              itemText="Set as home page"
              onClick={() => alert('Set as home page')}
            />
          </OverflowMenu>
        }
        href="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
      />
      <TileGalleryItem
        title="Card title"
        description="card description"
        moreInfoLink="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
        mode="grid"
        thumbnail={<Rocket fill="black" description="Icon" width={50} height={50} />}
        icon={<Check fill="#40be65" onClick={() => alert('favorite')} />}
        afterContent={
          <OverflowMenu
            floatingMenu
            onClick={evt => evt.preventDefault()}
            style={{ height: '2rem' }}
          >
            <OverflowMenuItem
              itemText="Set as home page"
              onClick={() => alert('Set as home page')}
            />
          </OverflowMenu>
        }
        href="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
      />
      <TileGalleryItem
        title="Card title"
        description="card description"
        moreInfoLink="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
        mode="grid"
        thumbnail={<Rocket fill="black" description="Icon" width={50} height={50} />}
        icon={<Check fill="#40be65" onClick={() => alert('favorite')} />}
        afterContent={
          <OverflowMenu
            floatingMenu
            onClick={evt => evt.preventDefault()}
            style={{ height: '2rem' }}
          >
            <OverflowMenuItem
              itemText="Set as home page"
              onClick={() => alert('Set as home page')}
            />
          </OverflowMenu>
        }
        href="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
      />
    </TileGallerySection>
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
              icon: <IconStarFav />,
              afterContent: (
                <OverflowMenu
                  floatingMenu
                  onClick={evt => evt.preventDefault()}
                  style={{ height: '2rem' }}
                  iconDescription={text('icon description', '__icon description__')}
                >
                  <OverflowMenuItem
                    itemText={text('Edit', '__Edit__')}
                    onClick={() => alert('Edit')}
                  />
                  <OverflowMenuItem
                    itemText={text('Share', '__Share__')}
                    onClick={() => alert('Share')}
                  />
                  <OverflowMenuItem
                    itemText={text('Move', '__Move__')}
                    onClick={() => alert('Move')}
                  />
                  <OverflowMenuItem
                    itemText={text('Delete', '__Delete__')}
                    onClick={() => alert('Delete')}
                  />
                </OverflowMenu>
              ),
              thumbnail: <Activity />,
              href: 'www.ibm.com',
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
