import { mount } from 'enzyme';
import React from 'react';
/* eslint-disable*/
import { Tooltip } from 'carbon-components-react';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import { Popup20 } from '@carbon/icons-react';
import { CARD_SIZES, CARD_TITLE_HEIGHT, CARD_ACTIONS } from '../../constants/LayoutConstants';
import { ToolbarSVGWrapper } from './CardToolbar';

import CardRangePicker from './CardRangePicker';

import Card, { SkeletonWrapper } from './Card';

const tooltipElement = <div>This is some other text</div>;

const cardProps = {
  title: 'My Title',
  id: 'my card',
};

describe('Card testcases', () => {
  test('small', () => {
    const wrapper = mount(<Card {...cardProps} size={CARD_SIZES.SMALL} />);

    // small should have full header
    expect(wrapper.find('.card--header')).toHaveLength(1);
  });

  test('child size prop', () => {
    const childRenderInTitleCard = jest.fn();

    mount(<Card title="My Title" size={CARD_SIZES.MEDIUM} children={childRenderInTitleCard} />);
    expect(childRenderInTitleCard).toHaveBeenCalledWith(
      {
        width: 0,
        height: -CARD_TITLE_HEIGHT,
        position: null,
      },
      expect.anything()
    );

    const childRenderInNoTitleCard = jest.fn();

    mount(<Card size={CARD_SIZES.MEDIUM} children={childRenderInNoTitleCard} />);
    expect(childRenderInNoTitleCard).toHaveBeenCalledWith(
      {
        width: 0,
        height: 0,
        position: null,
      },
      expect.anything()
    );
  });

  test('render icons', () => {
    let wrapper = mount(
      <Card {...cardProps} size={CARD_SIZES.SMALL} availableActions={{ range: true }} />
    );
    // should render CardRangePicker if isEditable is false
    expect(wrapper.find(CardRangePicker)).toHaveLength(1);

    wrapper = mount(
      <Card
        {...cardProps}
        size={CARD_SIZES.SMALL}
        availableActions={{ range: true, expand: true }}
      />
    );

    // should render CardRangePicker and Expand
    expect(wrapper.find(CardRangePicker)).toHaveLength(1);
    expect(wrapper.find(Popup20)).toHaveLength(1);

    wrapper = mount(
      <Card {...cardProps} size={CARD_SIZES.SMALL} isEditable availableActions={{ range: true }} />
    );
    // CardRangePicker icon should not render if isEditable prop is true
    expect(wrapper.find(CardRangePicker)).toHaveLength(0);
  });

  test('additional prop based elements', () => {
    let wrapper = mount(<Card {...cardProps} size={CARD_SIZES.LARGE} tooltip={tooltipElement} />);
    // tooltip prop will render a tooltip in the header
    expect(wrapper.find(Tooltip)).toHaveLength(1);
    // without the isLoading prop SkeletonWrapper should not be rendered
    expect(wrapper.find(SkeletonWrapper)).toHaveLength(0);
    // with the isLoading prop SkeletonWrapper should  be rendered
    wrapper = mount(
      <Card {...cardProps} isLoading size={CARD_SIZES.SMALLWIDE} tooltip={tooltipElement} />
    );
    expect(wrapper.find(SkeletonWrapper)).toHaveLength(1);
  });
  test('isExpanded', () => {
    let wrapper = mount(
      <Card {...cardProps} isExpanded size={CARD_SIZES.LARGE} tooltip={tooltipElement} />
    );
    //isExpanded renders the modal wrapper around it
    expect(wrapper.find('.bx--modal')).toHaveLength(1);
  });
  test('card actions', () => {
    const mockOnCardAction = jest.fn();
    let wrapper = mount(
      <Card
        {...cardProps}
        isExpanded
        size={CARD_SIZES.LARGE}
        tooltip={tooltipElement}
        onCardAction={mockOnCardAction}
        availableActions={{ expand: true }}
      />
    );
    wrapper
      .find(ToolbarSVGWrapper)
      .get(0)
      .props.onClick();
    expect(mockOnCardAction).toHaveBeenCalledWith(cardProps.id, CARD_ACTIONS.CLOSE_EXPANDED_CARD);

    mockOnCardAction.mockClear();
    let wrapper2 = mount(
      <Card
        {...cardProps}
        size={CARD_SIZES.LARGE}
        tooltip={tooltipElement}
        onCardAction={mockOnCardAction}
        availableActions={{ expand: true }}
      />
    );
    wrapper2
      .find(ToolbarSVGWrapper)
      .get(0)
      .props.onClick();
    expect(mockOnCardAction).toHaveBeenCalledWith(cardProps.id, CARD_ACTIONS.OPEN_EXPANDED_CARD);
  });
  test('card editable actions', async done => {
    const mockOnCardAction = jest.fn();
    const { getByRole, getByTitle, getByText } = render(
      <Card
        {...cardProps}
        isEditable
        size={CARD_SIZES.LARGE}
        tooltip={tooltipElement}
        onCardAction={mockOnCardAction}
        availableActions={{ edit: true, clone: true, delete: true }}
      />
    );
    fireEvent.click(getByTitle('Open and close list of options'));
    // Click on the first overflow menu item
    const firstMenuItem = await waitForElement(() => getByText('Edit card'));
    fireEvent.click(firstMenuItem);
    expect(mockOnCardAction).toHaveBeenCalledWith(cardProps.id, CARD_ACTIONS.EDIT_CARD);
    mockOnCardAction.mockClear();
    // Reopen menu
    fireEvent.click(getByTitle('Open and close list of options'));
    const secondElement = await waitForElement(() => getByText('Clone card'));
    fireEvent.click(secondElement);
    expect(mockOnCardAction).toHaveBeenCalledWith(cardProps.id, CARD_ACTIONS.CLONE_CARD);

    // Reopen menu
    fireEvent.click(getByTitle('Open and close list of options'));
    mockOnCardAction.mockClear();
    const thirdElement = await waitForElement(() => getByText('Delete card'));
    fireEvent.click(thirdElement);
    expect(mockOnCardAction).toHaveBeenCalledWith(cardProps.id, CARD_ACTIONS.DELETE_CARD);
    done();
  });
});
