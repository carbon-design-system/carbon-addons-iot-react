import React from 'react';
import { mount } from 'enzyme';

// import { content } from './TileGallery.story';
import TileGalleryItem from './TileGalleryItem';
import TileGallerySection from './TileGallerySection';

describe('TileGallery tests', () => {
  test('TileGalleryItem mode list', () => {
    const wrapper = mount(<TileGalleryItem title="title" mode="tile" />);

    expect(
      wrapper
        .find('a')
        .first()
        .hasClass('dashboard-pin-list-title')
    ).toEqual(true);
  });
  test('TileGalleryItem mode card', () => {
    const wrapper = mount(<TileGalleryItem title="title" mode="grid" />);

    expect(
      wrapper
        .find('a')
        .first()
        .hasClass('dashboard-pin-card-title')
    ).toEqual(true);
  });
  test('TileGalleryItem afterContent', () => {
    const wrapper = mount(
      <TileGalleryItem title="title" afterContent={<div>after content</div>} />
    );

    expect(wrapper.find('div.overflowMenu')).toHaveLength(1);
  });
  test('TileGallerySection', () => {
    const onClick = jest.fn();

    const wrapper = mount(
      <TileGallerySection title="Section 1" onClick={onClick}>
        <TileGalleryItem title="title" />
      </TileGallerySection>
    );

    wrapper
      .find('button.bx--accordion__heading')
      .first()
      .simulate('click');

    expect(wrapper.find('Accordion')).toHaveLength(1);
    expect(wrapper.find('AccordionItem').props().open).toEqual(false);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  test('TileGallerySection - no accordion', () => {
    const wrapper = mount(
      <TileGallerySection>
        <TileGalleryItem title="title" />
      </TileGallerySection>
    );

    expect(wrapper.find('Accordion')).toHaveLength(0);
  });
});
