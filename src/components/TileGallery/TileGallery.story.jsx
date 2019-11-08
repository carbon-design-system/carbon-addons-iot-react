/* Used dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageTitleBar, TileGallery, TileGallerySection, TileGalleryItem, Link } from '../../index';

export const content = (
  <TileGallery>
    <TileGallerySection title="Section 1">
      <TileGalleryItem title="00001" description="The first one" isFavorite />
      <TileGalleryItem title="00002" description="The second one" />
      <TileGalleryItem title="00005" description="The fifth one" isFavorite />
      <TileGalleryItem title="00003" />
    </TileGallerySection>
    <TileGallerySection title="More">
      <TileGalleryItem title="00010" description="Another one" />
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
  ));
