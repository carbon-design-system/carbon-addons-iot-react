import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import CardEditor from './CardEditor';

describe('CardEditor', () => {
  const actions = {
    onAddCard: jest.fn(),
    onShowGallery: jest.fn(),
    onChange: jest.fn(),
  };
  const defaultCard = {
    id: 'card-0001',
    title: 'New card',
    size: 'SMALL',
    type: 'VALUE',
  };

  it('fires onAddCard when user clicks on item in list', () => {
    render(
      <CardEditor
        supportedCardTypes={['VALUE', 'LINECHART', 'TABLE', 'CUSTOM']}
        onShowGallery={actions.onShowGallery}
        onChange={actions.onChange}
        onAddCard={actions.onAddCard}
      />
    );
    const addTableCardBtn = screen.getByTitle('Data table');
    userEvent.click(addTableCardBtn);
    expect(actions.onAddCard).toHaveBeenCalledTimes(1);
  });

  it('fires onChange when user edits title in form', () => {
    render(
      <CardEditor
        cardConfig={defaultCard}
        onShowGallery={actions.onShowGallery}
        onChange={actions.onChange}
        onAddCard={actions.onAddCard}
      />
    );
    userEvent.type(
      screen.getByRole('textbox', { name: 'Card title X-axis label' }),
      'z'
    );
    userEvent.tab();
    expect(actions.onChange).toHaveBeenCalledWith({
      ...defaultCard,
      title: `${defaultCard.title}z`,
    });
    actions.onChange.mockReset();
    userEvent.click(
      screen.getByRole('button', { name: `Size Small (4x1) Open menu` })
    );
    userEvent.click(screen.getByText('Medium wide (16x2)'));
    expect(actions.onChange).toHaveBeenCalledWith({
      ...defaultCard,
      size: 'MEDIUMWIDE',
    });
  });

  it('fires onChange when user edits description in form', () => {
    render(
      <CardEditor
        cardConfig={defaultCard}
        onShowGallery={actions.onShowGallery}
        onChange={actions.onChange}
        onAddCard={actions.onAddCard}
      />
    );
    userEvent.type(screen.getByLabelText('Description (Optional)'), 'z');
    userEvent.tab();
    expect(actions.onChange).toHaveBeenCalledWith({
      ...defaultCard,
      description: `z`,
    });
    actions.onChange.mockReset();
  });

  it('fires onShowGallery when user clicks button', () => {
    render(
      <CardEditor
        cardConfig={defaultCard}
        onShowGallery={actions.onShowGallery}
        onChange={actions.onChange}
        onAddCard={actions.onAddCard}
      />
    );
    userEvent.click(
      screen.getByRole('button', {
        name: CardEditor.defaultProps.i18n.openGalleryButton,
      })
    );
    expect(actions.onShowGallery).toHaveBeenCalledTimes(1);
  });

  it('opens and closes JSON code modal through button clicks', () => {
    render(
      <CardEditor
        cardConfig={defaultCard}
        onShowGallery={actions.onShowGallery}
        onChange={actions.onChange}
        onAddCard={actions.onAddCard}
      />
    );
    const openEditorBtn = screen.getByRole('button', {
      name: CardEditor.defaultProps.i18n.openJSONButton,
    });
    expect(openEditorBtn).toBeTruthy();
    userEvent.click(openEditorBtn);
    expect(screen.getByText('Edit card JSON configuration')).toBeTruthy();
    userEvent.click(screen.getByRole('button', { name: 'Close' }));
    userEvent.click(openEditorBtn);
    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    userEvent.click(openEditorBtn);
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
  });
});
