import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { mount } from 'enzyme';

import ComposedModal from '../../ComposedModal/ComposedModal';
import { TextInput } from '../../TextInput';
import { Checkbox } from '../../Checkbox';

import TableSaveViewForm from './TableSaveViewForm';
import TableSaveViewModal from './TableSaveViewModal';

describe('TableSaveViewModal', () => {
  const { i18n } = TableSaveViewModal.defaultProps;
  const actions = {
    onSave: jest.fn(),
    onClose: jest.fn(),
    onClearError: jest.fn(),
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes along all input data onSave callback', () => {
    render(<TableSaveViewModal actions={actions} open testID="my-modal" />);
    fireEvent.change(screen.getByTestId('my-modal-form-title-input'), {
      target: { value: 'testval1' },
    });
    fireEvent.click(screen.getByText(i18n.saveButtonLabelText));

    expect(actions.onSave).toHaveBeenCalledWith({
      isDefault: false,
      isPublic: false,
      title: 'testval1',
    });

    fireEvent.change(screen.getByTestId('my-modal-form-title-input'), {
      target: { value: 'testval2' },
    });
    fireEvent.click(screen.getByLabelText(i18n.defaultCheckboxLabelText));
    fireEvent.click(screen.getByLabelText(i18n.publicCheckboxLabelText));
    fireEvent.click(screen.getByText(i18n.saveButtonLabelText));

    expect(actions.onSave).toHaveBeenCalledWith({
      isDefault: true,
      isPublic: true,
      title: 'testval2',
    });
  });

  it('calls onChange when form elements value changes', () => {
    render(<TableSaveViewModal actions={actions} open testID="my-modal" />);
    fireEvent.change(screen.getByTestId('my-modal-form-title-input'), {
      target: { value: 'testval1' },
    });
    fireEvent.click(screen.getByLabelText(i18n.defaultCheckboxLabelText));
    fireEvent.click(screen.getByLabelText(i18n.publicCheckboxLabelText));

    expect(actions.onChange).toHaveBeenCalledWith({
      title: 'testval1',
    });
    expect(actions.onChange).toHaveBeenCalledWith({
      isDefault: true,
    });
    expect(actions.onChange).toHaveBeenCalledWith({
      isPublic: true,
    });
  });

  it('calls onClose on cancel and close-icon click', () => {
    render(<TableSaveViewModal actions={actions} open testID="my-modal" />);
    fireEvent.click(screen.getByText(i18n.cancelButtonLabelText));
    fireEvent.click(screen.getByRole('button', { name: i18n.closeIconDescription }));

    expect(actions.onClose).toHaveBeenCalledTimes(2);
  });

  it('handles errors correctly', () => {
    render(<TableSaveViewModal actions={actions} open testID="my-modal" error="my test error" />);
    expect(screen.queryByText('my test error')).toBeInTheDocument();
    expect(actions.onClearError).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'closes notification' }));
    expect(screen.queryByText('my test error')).not.toBeInTheDocument();
    expect(actions.onClearError).toHaveBeenCalled();
  });

  it('replaces the strings with i18n strings', () => {
    const i18nTest = {
      modalTitle: 'modal-title-test',
      modalBodyText: 'modal-body-test',
      titleInputLabelText: 'title-input-label-test',
      defaultCheckboxLabelText: 'default-checkbox-label-test',
      publicCheckboxLabelText: 'public-checkbox-label-test',
      closeIconDescription: 'close-icon-description-test',
      saveButtonLabelText: 'save-button-label-test',
      cancelButtonLabelText: 'cancel-button-label-test',
    };

    render(<TableSaveViewModal actions={actions} open testID="my-modal" i18n={i18nTest} />);

    expect(screen.getByText(i18nTest.modalTitle)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.modalBodyText)).toBeInTheDocument();
    expect(screen.getByLabelText(i18nTest.titleInputLabelText)).toBeInTheDocument();
    expect(screen.getByLabelText(i18nTest.defaultCheckboxLabelText)).toBeInTheDocument();
    expect(screen.getByLabelText(i18nTest.publicCheckboxLabelText)).toBeInTheDocument();
    expect(screen.getByTitle(i18nTest.closeIconDescription)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.saveButtonLabelText)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.cancelButtonLabelText)).toBeInTheDocument();

    const defaultI18n = TableSaveViewModal.defaultProps.i18n;
    expect(screen.queryByText(defaultI18n.modalTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(defaultI18n.modalBodyText)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(defaultI18n.titleInputLabelText)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(defaultI18n.defaultCheckboxLabelText)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(defaultI18n.publicCheckboxLabelText)).not.toBeInTheDocument();
    expect(screen.queryByTitle(defaultI18n.closeIconDescription)).not.toBeInTheDocument();
    expect(screen.queryByText(defaultI18n.saveButtonLabelText)).not.toBeInTheDocument();
    expect(screen.queryByText(defaultI18n.cancelButtonLabelText)).not.toBeInTheDocument();
  });

  it('has disabled Save unless the view title input has gotten a value', () => {
    render(<TableSaveViewModal actions={actions} open testID="my-modal" />);
    fireEvent.click(screen.getByText(i18n.saveButtonLabelText));

    expect(actions.onSave).not.toHaveBeenCalled();
  });

  it('correctly sets initial form values', () => {
    render(
      <TableSaveViewModal
        actions={actions}
        open
        testID="my-modal"
        initialFormValues={{
          title: 'titleVal',
          isDefault: true,
          isPublic: false,
        }}
      />
    );
    expect(screen.getByTestId('my-modal-form')).toHaveFormValues({
      title: 'titleVal',
      isDefault: true,
      isPublic: false,
    });
  });

  it('can be customised with component overrides', () => {
    const TestModal = props => {
      return <ComposedModal {...props} data-testid="custom-test-modal" />;
    };
    const TestTableSaveViewForm = props => {
      return <TableSaveViewForm {...props} testID="custom-test-form" />;
    };
    const TestTitleInput = props => {
      return <TextInput {...props} data-testid="custom-test-form-title-input" />;
    };
    const TestViewDescriptionContainer = props => {
      return <p {...props} data-testid="custom-test-form-description-container" />;
    };
    const TestDefaultCheckbox = props => {
      return <Checkbox {...props} data-testid="custom-test-form-default-checkbox" />;
    };
    const TestPublicCheckbox = props => {
      return <Checkbox {...props} data-testid="custom-test-form-public-checkbox" />;
    };

    render(
      <TableSaveViewModal
        actions={actions}
        open
        overrides={{
          composedModal: { component: TestModal },
          tableSaveViewForm: {
            component: TestTableSaveViewForm,
            props: {
              overrides: {
                titleTextInput: { component: TestTitleInput },
                viewDescriptionContainer: { component: TestViewDescriptionContainer },
                defaultCheckbox: { component: TestDefaultCheckbox },
                publicCheckbox: { component: TestPublicCheckbox },
              },
            },
          },
        }}
      />
    );
    expect(screen.getByTestId('custom-test-modal')).toBeInTheDocument();
    expect(screen.getByTestId('custom-test-form')).toBeInTheDocument();
    expect(screen.getByTestId('custom-test-form-title-input')).toBeInTheDocument();
    expect(screen.getByTestId('custom-test-form-description-container')).toBeInTheDocument();
    expect(screen.getByTestId('custom-test-form-default-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('custom-test-form-public-checkbox')).toBeInTheDocument();
  });

  it('can be customised with props overrides', () => {
    render(
      <TableSaveViewModal
        actions={actions}
        open
        overrides={{
          composedModal: { props: { 'data-testid': 'custom-test-modal' } },
          tableSaveViewForm: {
            props: {
              testID: 'custom-test-form',
              overrides: {
                titleTextInput: { props: { 'data-testid': 'custom-test-form-title-input' } },
                viewDescriptionContainer: {
                  props: { 'data-testid': 'custom-test-form-description-container' },
                },
                defaultCheckbox: { props: { 'data-testid': 'custom-test-form-default-checkbox' } },
                publicCheckbox: { props: { 'data-testid': 'custom-test-form-public-checkbox' } },
              },
            },
          },
        }}
      />
    );
    expect(screen.getByTestId('custom-test-modal')).toBeInTheDocument();
    expect(screen.getByTestId('custom-test-form')).toBeInTheDocument();
    expect(screen.getByTestId('custom-test-form-title-input')).toBeInTheDocument();
    expect(screen.getByTestId('custom-test-form-description-container')).toBeInTheDocument();
    expect(screen.getByTestId('custom-test-form-default-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('custom-test-form-public-checkbox')).toBeInTheDocument();
  });

  it('shows a description text', () => {
    render(<TableSaveViewModal actions={actions} open viewDescription="test view description" />);

    expect(screen.getByText('test view description')).toBeInTheDocument();
  });

  it('can be opened and closed', () => {
    const wrapper = mount(<TableSaveViewModal actions={actions} open />);
    expect(wrapper.exists('.bx--modal.is-visible')).toBeTruthy();

    wrapper.setProps({ ...wrapper.props(), open: false });
    wrapper.update();

    expect(wrapper.exists('.bx--modal.is-visible')).toBeFalsy();
  });

  it('i18n string tests', () => {
    const i18nTest = {
      modalTitle: 'modal-title',
      modalBodyText: `modal-body`,
      titleInputLabelText: 'title-input',
      defaultCheckboxLabelText: 'default-label',
      publicCheckboxLabelText: 'public-label',
      closeIconDescription: 'close-descript',
      saveButtonLabelText: 'save-button',
      cancelButtonLabelText: 'cancel-button',
    };

    const i18nDefault = TableSaveViewModal.defaultProps.i18n;

    render(<TableSaveViewModal actions={actions} i18n={i18nTest} />);

    expect(screen.getByText(i18nTest.modalTitle)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.modalBodyText)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.titleInputLabelText)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.defaultCheckboxLabelText)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.publicCheckboxLabelText)).toBeInTheDocument();
    expect(screen.getByLabelText(i18nTest.closeIconDescription)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.saveButtonLabelText)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.cancelButtonLabelText)).toBeInTheDocument();

    expect(screen.queryByText(i18nDefault.modalTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.modalBodyText)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.titleInputLabelText)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.defaultCheckboxLabelText)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.publicCheckboxLabelText)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefault.closeIconDescription)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.saveButtonLabelText)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.cancelButtonLabelText)).not.toBeInTheDocument();
  });
});
