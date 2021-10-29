import { mount } from 'enzyme';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

import { settings } from '../../../constants/Settings';

import { itemsAndComponents } from './TableDetailWizard.story';
import StatefulTableDetailWizard from './StatefulTableDetailWizard';

const { prefix, iotPrefix } = settings;

const commonWizardProps = {
  title: 'My Wizard',
  items: itemsAndComponents,
  currentItemId: itemsAndComponents[0].id,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
};

describe('StatefulWizardInline', () => {
  it('onNext', () => {
    const mockNext = jest.fn();
    const wrapper = mount(<StatefulTableDetailWizard {...commonWizardProps} onNext={mockNext} />);
    const cancelAndNextButtons = wrapper.find(`.${prefix}--btn`);
    expect(cancelAndNextButtons).toHaveLength(3);
    cancelAndNextButtons.at(2).simulate('click');
    expect(mockNext).toHaveBeenCalled();
  });
  it('onNext without currentItemId', () => {
    const mockNext = jest.fn();
    const wrapper = mount(
      <StatefulTableDetailWizard {...commonWizardProps} currentItemId="" onNext={mockNext} />
    );
    const cancelAndNextButtons = wrapper.find(`.${prefix}--btn`);
    expect(cancelAndNextButtons).toHaveLength(3);
    cancelAndNextButtons.at(2).simulate('click');
    expect(mockNext).toHaveBeenCalled();
  });
  it('setItem', () => {
    const mocks = {
      isClickable: true,
      setItem: jest.fn(),
    };
    render(<StatefulTableDetailWizard {...commonWizardProps} {...mocks} />);
    fireEvent.click(screen.getByText('Notifications'));
    expect(mocks.setItem).toHaveBeenCalledTimes(1);
  });
  it('error', () => {
    render(<StatefulTableDetailWizard {...commonWizardProps} error="I'm in error" />);
    expect(screen.queryAllByRole('alert')).toHaveLength(1);
  });
  it('error clear error', () => {
    const mockClearError = jest.fn();
    const wrapper = mount(
      <StatefulTableDetailWizard
        {...commonWizardProps}
        error="I'm in error"
        onClearError={mockClearError}
      />
    );
    const clearErrorButton = wrapper.find(`.${prefix}--inline-notification__close-button`);
    expect(clearErrorButton).toHaveLength(1);
    clearErrorButton.simulate('click');
    expect(mockClearError).toHaveBeenCalled();
  });
  it('setItem not triggered if invalid', () => {
    const mockSetItem = jest.fn();
    const wrapper = mount(
      <StatefulTableDetailWizard
        {...commonWizardProps}
        currentItemId="item1"
        items={[
          {
            id: 'item1',
            name: 'Item1',
            component: <div>Item 1</div>,
            onValidate: () => false,
          },
          {
            id: 'item2',
            name: 'Item2',
            component: <div>Item 2</div>,
            onValidate: () => false,
          },
        ]}
        setItem={mockSetItem}
      />
    );
    const progressIndicatorButtons = wrapper.find(`.${iotPrefix}--progress-step-button`);
    expect(progressIndicatorButtons).toHaveLength(2);
    progressIndicatorButtons.at(1).simulate('click');
    expect(mockSetItem).not.toHaveBeenCalled();
  });
  it('onNext not triggered if invalid', () => {
    const mockNext = jest.fn();
    const wrapper = mount(
      <StatefulTableDetailWizard
        {...commonWizardProps}
        currentItemId="item1"
        items={[
          {
            id: 'item1',
            name: 'Item1',
            component: <div>Item 1</div>,
            onValidate: () => false,
          },
          {
            id: 'item2',
            name: 'Item2',
            component: <div>Item 2</div>,
            onValidate: () => false,
          },
        ]}
        onNext={mockNext}
      />
    );
    const cancelAndNextButtons = wrapper.find(`.${prefix}--btn`);
    expect(cancelAndNextButtons).toHaveLength(3);
    cancelAndNextButtons.at(2).simulate('click');
    expect(mockNext).not.toHaveBeenCalled();
  });
  it('onClose', () => {
    const mockClose = jest.fn();
    const wrapper = mount(<StatefulTableDetailWizard {...commonWizardProps} onClose={mockClose} />);
    const cancelAndNextButtons = wrapper.find(`.${prefix}--btn`);
    expect(cancelAndNextButtons).toHaveLength(3);
    cancelAndNextButtons.at(1).simulate('click');
    expect(mockClose).toHaveBeenCalled();
  });
  it('onClose Top', () => {
    const mockClose = jest.fn();
    const wrapper = mount(<StatefulTableDetailWizard {...commonWizardProps} onClose={mockClose} />);
    const cancelAndNextButtons = wrapper.find(`.${prefix}--btn`);
    expect(cancelAndNextButtons).toHaveLength(3);
    cancelAndNextButtons.at(0).simulate('click');
    expect(mockClose).toHaveBeenCalled();
  });
  it('onBack', () => {
    const mockBack = jest.fn();
    const wrapper = mount(
      <StatefulTableDetailWizard
        {...commonWizardProps}
        currentItemId={itemsAndComponents[1].id}
        onBack={mockBack}
      />
    );
    const backAndNextButtons = wrapper.find(`.${prefix}--btn`);
    expect(backAndNextButtons).toHaveLength(3);
    backAndNextButtons.at(1).simulate('click');
    expect(mockBack).toHaveBeenCalled();
  });
  it('onNext not triggered if nextItem is undefined', () => {
    const mockNext = jest.fn();
    const wrapper = mount(
      <StatefulTableDetailWizard
        {...commonWizardProps}
        currentItemId={itemsAndComponents[itemsAndComponents.length - 1].id}
        onNext={mockNext}
      />
    );
    const cancelAndNextButtons = wrapper.find(`.${prefix}--btn`);
    expect(cancelAndNextButtons).toHaveLength(3);
    cancelAndNextButtons.at(2).simulate('click');
    expect(mockNext).not.toHaveBeenCalled();
  });
});
