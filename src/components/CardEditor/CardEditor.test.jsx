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
        supportedTypes={['VALUE', 'LINECHART', 'TABLE']}
        onShowGallery={actions.onShowGallery}
        onChange={actions.onChange}
        onAddCard={actions.onAddCard}
      />
    );
    const addTableCardBtn = screen.getByTestId('card-gallery-list-TABLE-add');
    userEvent.click(addTableCardBtn);
    expect(actions.onAddCard).toHaveBeenCalledTimes(1);
  });

  it('fires onChange when user edits title in form', () => {
    render(
      <CardEditor
        value={defaultCard}
        onShowGallery={actions.onShowGallery}
        onChange={actions.onChange}
        onAddCard={actions.onAddCard}
      />
    );
    userEvent.type(screen.getByRole('textbox', { name: 'Card title' }), 'z');
    userEvent.tab();
    expect(actions.onChange).toHaveBeenCalledWith({
      ...defaultCard,
      title: `${defaultCard.title}z`,
    });
    actions.onChange.mockReset();
    userEvent.click(
      screen.getByRole('button', { name: `Card size ${defaultCard.size} Open menu` })
    );
    userEvent.click(screen.getByText('MEDIUMWIDE'));
    expect(actions.onChange).toHaveBeenCalledWith({
      ...defaultCard,
      size: 'MEDIUMWIDE',
    });
  });

  it('fires onShowGallery when user clicks button', () => {
    render(
      <CardEditor
        value={defaultCard}
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
        value={defaultCard}
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
    expect(screen.getByRole('dialog', { name: 'Edit JSON' })).toBeTruthy();
    userEvent.click(screen.getByRole('button', { name: 'Close' }));
    userEvent.click(openEditorBtn);
    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    userEvent.click(openEditorBtn);
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
  });
});
