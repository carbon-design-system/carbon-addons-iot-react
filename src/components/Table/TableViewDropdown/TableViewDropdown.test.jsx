import React, { useState } from 'react';
import { mount } from 'enzyme';
import { Dropdown } from 'carbon-components-react';

import { settings } from '../../../constants/Settings';

import TableViewDropdown from './TableViewDropdown';

const { iotPrefix, prefix } = settings;

describe('TableViewDropdown', () => {
  const myViews = [
    {
      id: 'view-1',
      text: 'View 1',
    },
    {
      id: 'view-2',
      text: 'View 2',
    },
    {
      id: 'view-3',
      text: 'View 3',
    },
  ];

  const actions = {
    onSaveAsNewView: jest.fn(),
    onManageViews: jest.fn(),
    onChangeView: jest.fn(),
  };

  const itemSelector = `.${prefix}--list-box__menu-item__option`;
  const iotItemSelector = `.${prefix}--list-box__field .${iotPrefix}--view-dropdown__item`;

  it('adds a "view all" default item to the start of the list', () => {
    const wrapper = mount(
      <TableViewDropdown views={myViews} actions={actions} selectedViewId={myViews[2].id} />
    );
    const viewAllItem = wrapper.find(itemSelector).first();
    expect(viewAllItem.text()).toEqual('View All');
  });

  it('adds a "manage views" item at the end', () => {
    const wrapper = mount(<TableViewDropdown views={myViews} actions={actions} />);
    const manageViewsItem = wrapper.find(itemSelector).last();
    expect(manageViewsItem.text()).toEqual('Manage views');
  });

  it('adds a "save new view" item before the "manage views" item', () => {
    const wrapper = mount(<TableViewDropdown views={myViews} actions={actions} />);
    const saveViewItem = wrapper.find(itemSelector).at(4);
    expect(saveViewItem.text()).toEqual('Save as new view');
  });

  it('adds a "save view" item before the "manage views" item', () => {
    const wrapper = mount(<TableViewDropdown views={myViews} actions={actions} />);
    const saveViewItem = wrapper.find(itemSelector).at(5);
    expect(saveViewItem.text()).toEqual('Save view');
  });

  it('selected the proper item on init', () => {
    const wrapperWithoutInitialDefault = mount(
      <TableViewDropdown views={myViews} actions={actions} />
    );
    const viewAllItem = wrapperWithoutInitialDefault.find(iotItemSelector);
    expect(viewAllItem.props().title).toEqual('View All');

    const wrapperWithInitiallySelected = mount(
      <TableViewDropdown views={myViews} actions={actions} selectedViewId={myViews[0].id} />
    );
    const view1Item = wrapperWithInitiallySelected.find(iotItemSelector);
    expect(view1Item.props().title).toEqual('View 1');
  });

  it('can have the selected item set externally after initial render', () => {
    const wrapper = mount(
      <TableViewDropdown views={myViews} actions={actions} selectedViewId={myViews[0].id} />
    );
    const view1Item = wrapper.find(iotItemSelector);
    expect(view1Item.props().title).toEqual('View 1');

    wrapper.setProps({ ...wrapper.props(), selectedViewId: myViews[2].id });
    wrapper.update();

    const view3Item = wrapper.find(iotItemSelector);
    expect(view3Item.props().title).toEqual('View 3');
  });

  it('adds a "edited" postfix to selected item & title when activeViewEdited is true', () => {
    const wrapper = mount(<TableViewDropdown views={myViews} actions={actions} activeViewEdited />);
    const selectedItem = wrapper.find(iotItemSelector);
    expect(selectedItem.props().title).toEqual('View All - Edited');

    const editedText = wrapper.find(
      `.${prefix}--list-box__field .${iotPrefix}--view-dropdown__edited-text`
    );
    expect(editedText.text()).toEqual(' - Edited');
  });

  it('calls the proper actions', () => {
    const onChangeView = jest.fn();
    const wrapper = mount(
      React.createElement(() => {
        // We need to handle the state changes here so that the actual
        // selections based on click events get reflected in the component.
        const [selectedViewId, setSelectedViewId] = useState(undefined);
        return (
          <TableViewDropdown
            views={myViews}
            actions={{
              ...actions,
              onChangeView: onChangeView.mockImplementation(viewItem => {
                setSelectedViewId(viewItem.id);
              }),
            }}
            activeViewEdited
            selectedViewId={selectedViewId}
          />
        );
      })
    );

    expect(actions.onSaveAsNewView).not.toBeCalled();
    expect(actions.onManageViews).not.toBeCalled();
    expect(onChangeView).not.toBeCalled();

    const manageViewsItem = wrapper.find(itemSelector).last();
    manageViewsItem.simulate('click');

    const view1 = wrapper.find(itemSelector).at(1);
    view1.simulate('click');
    const view2 = wrapper.find(itemSelector).at(2);
    view2.simulate('click');
    const view3 = wrapper.find(itemSelector).at(3);
    view3.simulate('click');
    const defaultViewsItem = wrapper.find(itemSelector).first();
    defaultViewsItem.simulate('click');

    const SaveNewViewsItem = wrapper.find(itemSelector).at(4);
    SaveNewViewsItem.simulate('click');

    expect(actions.onSaveAsNewView).toBeCalledTimes(1);
    expect(actions.onManageViews).toBeCalledTimes(1);
    expect(onChangeView).toBeCalledTimes(4);
  });

  it('renders an icon for the manage views item', () => {
    const wrapper = mount(<TableViewDropdown views={myViews} actions={actions} activeViewEdited />);
    const manageViewsItem = wrapper.find(itemSelector).last();
    expect(manageViewsItem.exists('svg')).toBeTruthy();
  });

  it('can be overridden to use another dropdown component', () => {
    const MyDropdown = props => {
      return (
        <div className="my-dropdown">
          <Dropdown {...props} />
        </div>
      );
    };
    const wrapper = mount(
      <TableViewDropdown
        views={myViews}
        actions={actions}
        overrides={{ dropdown: { component: MyDropdown } }}
      />
    );
    expect(wrapper.exists('.my-dropdown')).toBeTruthy();
  });

  it('can be overridden to use custom Dropdown props', () => {
    const wrapper = mount(
      <TableViewDropdown
        views={myViews}
        actions={actions}
        overrides={{
          dropdown: {
            props: {
              items: [
                {
                  id: 'view-1',
                  text: 'View 1',
                },
              ],
            },
          },
        }}
      />
    );
    const allItems = wrapper.find(itemSelector);
    expect(allItems.length).toEqual(1);
  });

  it('can be overridden to use another TableViewDropdownItem', () => {
    const wrapper = mount(
      <TableViewDropdown
        views={myViews}
        actions={actions}
        overrides={{
          dropdownItem: {
            component: () => 'myItem',
          },
        }}
      />
    );
    const firstItem = wrapper.find(itemSelector).first();
    expect(firstItem.text()).toEqual('myItem');
  });

  it('can be overridden to use custom TableViewDropdownItem props', () => {
    const wrapper = mount(
      <TableViewDropdown
        views={myViews}
        actions={actions}
        overrides={{
          dropdownItem: {
            props: { isCompact: true },
          },
        }}
      />
    );
    const firstTableViewDropdownItem = wrapper
      .find(itemSelector)
      .first()
      .find('TableViewDropdownItem');
    expect(firstTableViewDropdownItem.props().isCompact).toEqual(true);
  });
});
