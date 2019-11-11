/* Used dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
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
  Link,
  OverflowMenu,
  OverflowMenuItem,
} from '../../index';

export const content = (
  <TileGallery>
    <TileGallerySection title="Section 1">
      <TileGalleryItem
        title="Manage"
        description="Detailed description of this particular Solution could go here"
        descriptionMoreInfo="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
        mode="grid"
        thumbnail={<Rocket fill="black" description="Icon" width="50" height="50" />}
        leftContent={<Check fill="#40be65" onClick={() => alert('favorite')} />}
        rightContent={
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
        title="Monitor"
        description="Detailed description of this particular Solution could go here"
        descriptionMoreInfo="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
        mode="grid"
        thumbnail={<Activity fill="black" description="Icon" width="50" height="50" />}
        leftContent={<Check fill="#40be65" onClick={() => alert('favorite')} />}
        rightContent={
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
        title="Health"
        description="Detailed description of this particular Solution could go here"
        descriptionMoreInfo="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
        mode="grid"
        thumbnail={<Sunny fill="black" description="Icon" width="50" height="50" />}
        leftContent={<Check fill="#40be65" onClick={() => alert('favorite')} />}
        rightContent={
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
        title="Health"
        description="Detailed description of this particular Solution could go here"
        descriptionMoreInfo="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
        mode="grid"
        thumbnail={<Sunny fill="black" description="Icon" width="50" height="50" />}
        leftContent={<Check fill="#40be65" onClick={() => alert('favorite')} />}
        rightContent={
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

storiesOf('Watson IoT Experimental|TileGallery', module)
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
      title="Manage"
      description="Detailed description of this particular Solution could go here"
      descriptionMoreInfo="https://www.ibm.com/br-pt/cloud/internet-of-things?mhsrc=ibmsearch_a&mhq=iot"
      mode="grid"
      thumbnail={<Rocket fill="black" description="Icon" width="50" height="50" />}
      leftContent={<Check fill="#40be65" onClick={() => alert('favorite')} />}
      rightContent={
        <OverflowMenu floatingMenu onClick={evt => evt.preventDefault()} style={{ height: '2rem' }}>
          <OverflowMenuItem itemText="Set as home page" onClick={() => alert('Set as home page')} />
        </OverflowMenu>
      }
      width={text('Card width', '305px')}
      height={text('Card height', '272px')}
    />
  ))
  .add('TileGalleryItem - Tile', () => (
    <TileGalleryItem
      title="Test"
      description="The first one"
      mode="tile"
      leftContent={<IconStarFav fill="black" onClick={() => alert('favorite')} />}
      rightContent={
        <OverflowMenu floatingMenu onClick={evt => evt.preventDefault()} style={{ height: '2rem' }}>
          <OverflowMenuItem itemText="Set as home page" onClick={() => alert('Set as home page')} />
        </OverflowMenu>
      }
      width={text('Card width', '305px')}
    />
  ));
