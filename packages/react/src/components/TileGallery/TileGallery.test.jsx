import React from 'react';
import { mount, shallow } from 'enzyme';
import { render, screen } from '@testing-library/react';

import { galleryData } from './TileGallery.story';
import TileGalleryItem from './TileGalleryItem';
import TileGallerySection from './TileGallerySection';
import TileGallerySearch from './TileGallerySearch';
import TileGalleryViewSwitcher from './TileGalleryViewSwitcher';
import TileGallery from './TileGallery';
import StatefulTileGallery from './StatefulTileGallery';

describe('TileGallery', () => {
  it('should be selectable by testId', () => {
    const { rerender } = render(
      <TileGalleryItem
        title="title"
        mode="list"
        testId="tile_gallery_item"
        afterContent={<div>Hi!</div>}
      />
    );

    expect(screen.getByTestId('tile_gallery_item')).toBeDefined();
    expect(screen.getByTestId('tile_gallery_item-overflow-menu')).toBeDefined();

    rerender(
      <TileGallerySection title="Section 1" onClick={jest.fn()} testId="tile_gallery_section">
        <TileGalleryItem title="title" />
      </TileGallerySection>
    );

    expect(screen.getByTestId('tile_gallery_section')).toBeDefined();
    expect(screen.getByTestId('tile_gallery_section-items')).toBeDefined();
    expect(screen.getByTestId('tile_gallery_section-accordion')).toBeDefined();
    expect(screen.getByTestId('tile_gallery_section-accordion-item')).toBeDefined();
    expect(screen.getByTestId('tile-gallery-item')).toBeDefined();

    rerender(<TileGalleryViewSwitcher onChange={jest.fn()} testId="tile_gallery_switcher" />);
    expect(screen.getByTestId('tile_gallery_switcher')).toBeDefined();
    expect(screen.getByTestId('tile_gallery_switcher-list-switch')).toBeDefined();
    expect(screen.getByTestId('tile_gallery_switcher-grid-switch')).toBeDefined();

    const onClick = jest.fn();
    rerender(
      <StatefulTileGallery
        title="Dashboard"
        hasSearch
        hasSwitcher
        hasButton
        buttonText="Create"
        galleryData={galleryData.map((gd) => ({
          ...gd,
          galleryItems: gd.galleryItems.map((gi) => ({ ...gi, onClick })),
        }))}
        testId="stateful_tile_gallery"
      />
    );
    expect(screen.getByTestId('stateful_tile_gallery')).toBeDefined();
    expect(screen.getByTestId('stateful_tile_gallery-page-title-bar')).toBeDefined();
    expect(screen.getByTestId('stateful_tile_gallery-extra-content')).toBeDefined();
    expect(screen.getByTestId('stateful_tile_gallery-search-input')).toBeDefined();
    expect(screen.getByTestId('stateful_tile_gallery-switcher')).toBeDefined();
    expect(screen.getByTestId('stateful_tile_gallery-switcher-grid-switch')).toBeDefined();
    expect(screen.getByTestId('stateful_tile_gallery-switcher-list-switch')).toBeDefined();
    expect(screen.getByTestId('stateful_tile_gallery-section-id1')).toBeDefined();
    expect(screen.getByTestId('stateful_tile_gallery-section-id1-item-0')).toBeDefined();
  });

  it('TileGalleryItem mode list', () => {
    const wrapper = mount(<TileGalleryItem title="title" mode="list" />);

    expect(wrapper.find('a').first().hasClass('tile-list-title')).toEqual(true);
  });
  it('TileGalleryItem mode list with node description', () => {
    const descriptionNode = <div>Test node</div>;
    const wrapper = mount(
      <TileGalleryItem title="title" mode="list" description={descriptionNode} />
    );

    expect(wrapper.find('div.description-card').contains(descriptionNode)).toEqual(true);
  });
  it('TileGalleryItem mode card', () => {
    const wrapper = mount(<TileGalleryItem title="title" mode="grid" />);

    expect(wrapper.find('a').first().hasClass('tile-card-title')).toEqual(true);
  });
  it('TileGalleryItem mode card with node description', () => {
    const descriptionNode = <div>Test node</div>;

    const wrapper = mount(
      <TileGalleryItem title="title" mode="grid" description={descriptionNode} />
    );

    expect(wrapper.find('div.description-card').contains(descriptionNode)).toEqual(true);
  });
  it('TileGalleryItem afterContent', () => {
    const wrapper = shallow(
      <TileGalleryItem title="title" afterContent={<div>after content</div>} />
    );

    wrapper.find('div.overflow-menu').simulate('click', {
      preventDefault() {},
      stopPropagation() {},
    });

    expect(wrapper.find('div.overflow-menu')).toHaveLength(1);
  });
  it('TileGalleryItem - have default onClick', () => {
    expect(TileGalleryItem.defaultProps.onClick).toBeDefined();
    expect(TileGalleryItem.defaultProps.onClick()).toBe(undefined);
  });
  it('TileGalleryItem - simulate onClick', () => {
    const onClick = jest.fn();

    const wrapper = mount(<TileGalleryItem title="title" mode="grid" onClick={onClick} />);

    wrapper.simulate('click', { target: {} });

    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it('TileGallerySection - have default onClick', () => {
    expect(TileGallerySection.defaultProps.onClick).toBeDefined();
    expect(TileGallerySection.defaultProps.onClick()).toBe(undefined);
  });
  it('TileGallerySection', () => {
    const onClick = jest.fn();

    const wrapper = mount(
      <TileGallerySection title="Section 1" onClick={onClick}>
        <TileGalleryItem title="title" />
      </TileGallerySection>
    );

    wrapper.find('button.bx--accordion__heading').first().simulate('click');

    expect(wrapper.find('Accordion')).toHaveLength(1);
    expect(wrapper.find('AccordionItem').props().open).toEqual(false);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it('TileGallerySection - no accordion', () => {
    const wrapper = mount(
      <TileGallerySection>
        <TileGalleryItem title="title" />
      </TileGallerySection>
    );

    expect(wrapper.find('Accordion')).toHaveLength(0);
  });
  it('TileGallerySearch - have default onChange', () => {
    expect(TileGallerySearch.defaultProps.onChange).toBeDefined();
    expect(TileGallerySearch.defaultProps.onChange()).toBe(undefined);
  });
  it('TileGallerySearch - simulate search', () => {
    const onChange = jest.fn();

    const wrapper = mount(<TileGallerySearch onChange={onChange} />);

    wrapper.find('input.bx--search-input').simulate('change', { target: { value: 'foo' } });

    expect(onChange).toHaveBeenCalled(); // https://github.com/carbon-design-system/carbon/issues/7595
  });
  it('TileGalleryViewSwitcher - have default onChange', () => {
    expect(TileGalleryViewSwitcher.defaultProps.onChange).toBeDefined();
    expect(TileGalleryViewSwitcher.defaultProps.onChange()).toBe(undefined);
  });
  it('TileGalleryViewSwitcher - simulate change', () => {
    const onChange = jest.fn();

    const wrapper = mount(<TileGalleryViewSwitcher onChange={onChange} />);

    wrapper.find('button.bx--content-switcher-btn').last().simulate('click');

    expect(onChange).toHaveBeenCalledTimes(1);
  });
  it('TileGallery', () => {
    const wrapper = mount(
      <TileGallery>
        <TileGallerySection>
          <TileGalleryItem title="title" />
        </TileGallerySection>
      </TileGallery>
    );

    expect(wrapper.find('TileGallerySection').props().isOpen).toEqual(true);
  });
  it('StatefulTileGallery', () => {
    const searchValue = 'description';

    const onClick = jest.fn();

    // replace storyboard action with jest.fn()
    const modifiedGalleryData = galleryData.map((gd) => ({
      ...gd,
      galleryItems: gd.galleryItems.map((gi) => ({ ...gi, onClick })),
    }));

    const wrapper = mount(
      <StatefulTileGallery
        title="Dashboard"
        hasSearch
        hasSwitcher
        hasButton
        buttonText="Create"
        galleryData={modifiedGalleryData}
      />
    );

    const noExtraWrapper = mount(
      <StatefulTileGallery title="Dashboard" galleryData={galleryData} />
    );

    wrapper
      .find('input.bx--search-input')
      .simulate('change', { currentTarget: { value: searchValue } });

    // test input value have changed
    // expect(wrapper.find('input.bx--search-input').props().value).toEqual(searchValue);

    // Test default mode
    expect(wrapper.find('TileGalleryItem').first().props().mode).toEqual('grid');

    // test tile onClick
    wrapper.find('.tile-gallery-item').first().simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);

    // Change Tile Item mode
    wrapper.find('button.bx--content-switcher-btn').first().simulate('click');

    // test have changes mode prop
    expect(wrapper.find('TileGalleryItem').first().props().mode).toEqual('list');

    // validation on component with search/switcher/button
    expect(noExtraWrapper.find('TileGallerySearch')).toHaveLength(0);
    expect(noExtraWrapper.find('TileGalleryViewSwitcher')).toHaveLength(0);
    expect(noExtraWrapper.find('Button')).toHaveLength(0);
  });
});
