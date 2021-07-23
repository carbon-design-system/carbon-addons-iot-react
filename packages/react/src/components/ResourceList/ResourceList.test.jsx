import React from 'react';
import { mount } from 'enzyme';
import Edit16 from '@carbon/icons-react';
import { render, screen } from '@testing-library/react';

import ResourceList from './ResourceList';

const resourceData = [
  {
    id: 'row-0',
    title: 'Item A',
    description:
      'Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed.',
  },
  {
    id: 'row-1',
    title: 'Item B',
    description:
      'Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed.',
  },
  {
    id: 'row-2',
    title: 'Item C',
    description:
      'Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed. Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed.Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed.Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed.Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed.Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed.Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed.',
  },
];

describe('ResourceList', () => {
  it('should be selectable by testId', () => {
    const actionClick = jest.fn();
    render(
      <ResourceList
        design="normal"
        data={resourceData}
        customAction={{
          onClick: actionClick,
          label: 'Configure',
          icon: Edit16,
        }}
        testId="resource_list"
      />
    );
    expect(screen.getByTestId('resource_list')).toBeDefined();
    expect(screen.getByTestId('resource_list-row-row-0')).toBeDefined();
    expect(screen.getByTestId('resource_list-custom-action-row-0')).toBeDefined();
  });

  // handle click function test
  it('onRowClick', () => {
    const onRowClick = jest.fn();
    const wrapper = mount(
      <ResourceList
        design="normal"
        data={resourceData}
        onRowClick={onRowClick}
        currentItemId="row-2"
      />
    );

    wrapper.find('label[onClick]').first().simulate('click');
    expect(onRowClick.mock.calls).toHaveLength(1);
  });
  it('customAction', () => {
    const actionClick = jest.fn();
    const wrapper = mount(
      <ResourceList
        design="normal"
        data={resourceData}
        customAction={{
          onClick: actionClick,
          label: 'Configure',
          icon: Edit16,
        }}
      />
    );
    wrapper.find('button[onClick]').first().simulate('click');
    expect(actionClick.mock.calls).toHaveLength(1);
  });
  it('extraContent', () => {
    const wrapper = mount(
      <ResourceList
        design="normal"
        data={resourceData}
        currentItemId="row-2"
        extraContent={resourceData.map((i) => i.id)}
      />
    );
    expect(wrapper.find('div.bx--structured-list-td').first().contains(resourceData[0].id)).toEqual(
      true
    );
  });
});
