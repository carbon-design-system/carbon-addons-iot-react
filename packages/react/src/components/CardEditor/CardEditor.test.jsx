import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { EscalatorDown } from '@carbon/pictograms-react';

import CardEditor from './CardEditor';

describe('CardEditor', () => {
  const actions = {
    onAddCard: jest.fn(),
    onShowGallery: jest.fn(),
    onChange: jest.fn(),
    onEditDataItems: jest.fn(),
  };
  const defaultCard = {
    id: 'card-0001',
    title: 'New card',
    size: 'SMALL',
    type: 'VALUE',
  };

  it('is selectable by testID and testId', () => {
    const { rerender } = render(
      <CardEditor
        supportedCardTypes={['VALUE', 'LINECHART', 'TABLE', 'CUSTOM']}
        onShowGallery={actions.onShowGallery}
        onChange={actions.onChange}
        onAddCard={actions.onAddCard}
        onEditDataItems={actions.onEditDataItems}
        testID="CARD_EDITOR"
      />
    );

    expect(screen.getByTestId('CARD_EDITOR')).toBeTruthy();

    rerender(
      <CardEditor
        supportedCardTypes={['VALUE', 'LINECHART', 'TABLE', 'CUSTOM']}
        onShowGallery={actions.onShowGallery}
        onChange={actions.onChange}
        onAddCard={actions.onAddCard}
        onEditDataItems={actions.onEditDataItems}
        testId="card-editor"
        isSummaryDashboard
      />
    );
    expect(screen.getByTestId('card-editor')).toBeTruthy();
    expect(screen.getByTestId('card-editor-card-gallery-list')).toBeTruthy();
    expect(screen.getByTestId('Button')).toBeTruthy();
  });

  it('fires onAddCard when user clicks on item in list', () => {
    render(
      <CardEditor
        supportedCardTypes={['VALUE', 'LINECHART', 'TABLE', 'CUSTOM']}
        onShowGallery={actions.onShowGallery}
        onChange={actions.onChange}
        onAddCard={actions.onAddCard}
        onEditDataItems={actions.onEditDataItems}
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
        onEditDataItems={actions.onEditDataItems}
      />
    );
    userEvent.type(screen.getByRole('textbox', { name: 'Card title' }), 'z');
    userEvent.tab();
    expect(actions.onChange).toHaveBeenCalledWith({
      ...defaultCard,
      title: `${defaultCard.title}z`,
    });
    actions.onChange.mockReset();
    userEvent.click(screen.getByRole('button', { name: 'Size Small (4x1) Open menu' }));
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
        onEditDataItems={actions.onEditDataItems}
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
        onEditDataItems={actions.onEditDataItems}
      />
    );
    userEvent.click(
      screen.getByRole('button', {
        name: CardEditor.defaultProps.i18n.openGalleryButton,
      })
    );
    expect(actions.onShowGallery).toHaveBeenCalledTimes(1);
  });

  it('shows gallery when no card is defined', () => {
    render(<CardEditor onShowGallery={jest.fn()} onChange={jest.fn()} onAddCard={jest.fn()} />);

    expect(screen.getByText('Gallery')).toBeTruthy();
  });

  it('shows custom gallery', () => {
    const testId = 'escalator';
    const inDomText = 'In The Dom';
    const notInDomText = 'Not In The Dom';
    render(
      <CardEditor
        i18n={{
          TIMESERIES: notInDomText,
          SIMPLE_BAR: notInDomText,
          GROUPED_BAR: notInDomText,
          STACKED_BAR: notInDomText,
          VALUE: inDomText,
          COOL_NEW_CARD: inDomText,
        }}
        onShowGallery={actions.onShowGallery}
        onChange={actions.onChange}
        onAddCard={actions.onAddCard}
        supportedCardTypes={['VALUE', 'COOL_NEW_CARD']}
        icons={{
          VALUE: <EscalatorDown data-testid={testId} />,
        }}
      />
    );

    expect(screen.getByText('Gallery')).toBeTruthy();
    expect(screen.getByTestId(testId)).toBeTruthy();
    expect(screen.queryAllByText(notInDomText).length).toBe(0);
    expect(screen.queryAllByText(inDomText).length).toBe(2);
  });

  it('opens and closes JSON code modal through button clicks', () => {
    render(
      <CardEditor
        cardConfig={defaultCard}
        onShowGallery={actions.onShowGallery}
        onChange={actions.onChange}
        onAddCard={actions.onAddCard}
        onEditDataItems={actions.onEditDataItems}
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

  it('should call onChange when changing the Time range', () => {
    render(
      <CardEditor
        cardConfig={defaultCard}
        onShowGallery={actions.onShowGallery}
        onChange={actions.onChange}
        onAddCard={actions.onAddCard}
        onEditDataItems={actions.onEditDataItems}
      />
    );
    userEvent.click(screen.getByText('Select a time range'));
    userEvent.click(screen.getByText('Last 7 days'));
    expect(actions.onChange).toHaveBeenLastCalledWith({
      dataSource: { range: { count: -1, interval: 'week', type: 'rolling' } },
      id: 'card-0001',
      size: 'SMALL',
      timeRange: 'last7Days',
      title: 'New card',
      type: 'VALUE',
    });
    userEvent.click(screen.getByText('Last 7 days'));
    userEvent.click(screen.getByText('This week'));
    expect(actions.onChange).toHaveBeenLastCalledWith({
      dataSource: { range: { count: -1, interval: 'week', type: 'periodToDate' } },
      id: 'card-0001',
      size: 'SMALL',
      timeRange: 'thisWeek',
      title: 'New card',
      type: 'VALUE',
    });
  });
});
