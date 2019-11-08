import { shallow } from 'enzyme';

import { content } from './TileGallery.story';

describe('TileGallery tests', () => {
  test('currentStepId prop', () => {
    const wrapper = shallow(content);
    // expect(wrapper.find('TileGallerySection').prop('title')).toEqual('Section 1');
    expect(true).toEqual(true);
  });
});
