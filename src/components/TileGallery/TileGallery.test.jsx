import React from 'react';
import { mount, shallow } from 'enzyme';

import { galleryData } from './TileGallery.story';
import TileGalleryItem from './TileGalleryItem';
import TileGallerySection from './TileGallerySection';
import TileGallerySearch from './TileGallerySearch';
import TileGalleryViewSwitcher from './TileGalleryViewSwitcher';
import TileGallery from './TileGallery';
import StatefulTileGallery from './StatefulTileGallery';

describe('TileGallery tests', () => {
  test('TileGalleryItem mode list', () => {
    const wrapper = mount(<TileGalleryItem title="title" mode="list" />);

    expect(
      wrapper
        .find('a')
        .first()
        .hasClass('tile-list-title')
    ).toEqual(true);
  });
  test('TileGalleryItem mode list with node description', () => {
    const descriptionNode = <div>Test node</div>;
    const wrapper = mount(
      <TileGalleryItem title="title" mode="list" description={descriptionNode} />
    );

    expect(wrapper.find('div.description-card').contains(descriptionNode)).toEqual(true);
  });
  test('TileGalleryItem mode card', () => {
    const wrapper = mount(<TileGalleryItem title="title" mode="grid" />);

    expect(
      wrapper
        .find('a')
        .first()
        .hasClass('tile-card-title')
    ).toEqual(true);
  });
  test('TileGalleryItem mode card with node description', () => {
    const descriptionNode = <div>Test node</div>;

    const wrapper = mount(
      <TileGalleryItem title="title" mode="grid" description={descriptionNode} />
    );

    expect(wrapper.find('div.description-card').contains(descriptionNode)).toEqual(true);
  });
  test('TileGalleryItem afterContent', () => {
    const wrapper = shallow(
      <TileGalleryItem title="title" afterContent={<div>after content</div>} />
    );

    wrapper.find('div.overflow-menu').simulate('click', {
      preventDefault() {},
      stopPropagation() {},
    });

    expect(wrapper.find('div.overflow-menu')).toHaveLength(1);
  });
  test('TileGalleryItem - have default onClick', () => {
    expect(TileGalleryItem.defaultProps.onClick).toBeDefined();
    expect(TileGalleryItem.defaultProps.onClick()).toBe(undefined);
  });
  test('TileGalleryItem - simulate onClick', () => {
    const onClick = jest.fn();

    const wrapper = mount(<TileGalleryItem title="title" mode="grid" onClick={onClick} />);

    wrapper.simulate('click', { target: {} });

    expect(onClick).toHaveBeenCalledTimes(1);
  });
  test('TileGallerySection - have default onClick', () => {
    expect(TileGallerySection.defaultProps.onClick).toBeDefined();
    expect(TileGallerySection.defaultProps.onClick()).toBe(undefined);
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
  test('TileGallerySearch - have default onChange', () => {
    expect(TileGallerySearch.defaultProps.onChange).toBeDefined();
    expect(TileGallerySearch.defaultProps.onChange()).toBe(undefined);
  });
  test('TileGallerySearch - simulate search', () => {
    const onChange = jest.fn();

    const wrapper = mount(<TileGallerySearch onChange={onChange} />);

    wrapper.find('input.bx--search-input').simulate('change', { target: { value: 'foo' } });

    expect(onChange).toHaveBeenCalledTimes(1);
  });
  test('TileGalleryViewSwitcher - have default onChange', () => {
    expect(TileGalleryViewSwitcher.defaultProps.onChange).toBeDefined();
    expect(TileGalleryViewSwitcher.defaultProps.onChange()).toBe(undefined);
  });
  test('TileGalleryViewSwitcher - simulate change', () => {
    const onChange = jest.fn();

    const wrapper = mount(<TileGalleryViewSwitcher onChange={onChange} />);

    wrapper
      .find('button.bx--content-switcher-btn')
      .last()
      .simulate('click');

    expect(onChange).toHaveBeenCalledTimes(1);
  });
  test('TileGallery', () => {
    const wrapper = mount(
      <TileGallery>
        <TileGallerySection>
          <TileGalleryItem title="title" />
        </TileGallerySection>
      </TileGallery>
    );

    expect(wrapper.find('TileGallerySection').props().isOpen).toEqual(true);
  });
  test('StatefulTileGallery', () => {
    const searchValue = 'description';

    const wrapper = mount(
      <StatefulTileGallery
        title="Dashboard"
        hasSearch
        hasSwitcher
        hasButton
        buttonText="Create"
        galleryData={galleryData}
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
    expect(
      wrapper
        .find('TileGalleryItem')
        .first()
        .props().mode
    ).toEqual('grid');

    // Change Tile Item mode
    wrapper
      .find('button.bx--content-switcher-btn')
      .first()
      .simulate('click');
    // console.log(`component::: ${noExtraWrapper.find('TileGallerySearch').debug()}`);

    // test have changes mode prop
    expect(
      wrapper
        .find('TileGalleryItem')
        .first()
        .props().mode
    ).toEqual('list');

    // validation on component with search/switcher/button
    expect(noExtraWrapper.find('TileGallerySearch')).toHaveLength(0);
    expect(noExtraWrapper.find('TileGalleryViewSwitcher')).toHaveLength(0);
    expect(noExtraWrapper.find('Button')).toHaveLength(0);
  });
});
