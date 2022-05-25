import React from 'react';
import { render, screen } from '@testing-library/react';

import { CARD_DIMENSIONS, CARD_SIZES, CARD_TYPES } from '../../../constants/LayoutConstants';

import CardEditForm, { getCardSizeText } from './CardEditForm';

const mockOnChange = jest.fn();
const mockOnCardJsonPreview = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});
describe('CardEditForm', () => {
  describe('CardEditForm', () => {
    it('should NOT render the settings tab if it is a custom card with no renderSettings function', () => {
      render(
        <CardEditForm
          cardConfig={{
            title: 'Custom card',
            size: 'MEDIUM',
            type: CARD_TYPES.CUSTOM,
            content: <h5>Custom content</h5>,
          }}
          onChange={mockOnChange}
          onCardJsonPreview={mockOnCardJsonPreview}
        />
      );
      const settingsTab = screen.queryByText('Settings');

      expect(settingsTab).not.toBeInTheDocument();
    });
    it('should render the settings tab if it is a custom card with no renderSettings function', () => {
      render(
        <CardEditForm
          cardConfig={{
            title: 'Custom card',
            size: 'MEDIUM',
            type: CARD_TYPES.CUSTOM,
            content: <h5>Custom content</h5>,
            renderEditSettings: () => <input type="text" />,
          }}
          onChange={mockOnChange}
          onCardJsonPreview={mockOnCardJsonPreview}
        />
      );
      const settingsTab = screen.getByText('Settings');

      expect(settingsTab).toBeInTheDocument();
    });
  });
  describe('getCardSizeText', () => {
    const i18n = {
      cardSize_SMALL: 'Small',
      cardSize_SMALLWIDE: 'Small wide',
      cardSize_MEDIUM: 'Medium',
      cardSize_MEDIUMTHIN: 'Medium thin',
      cardSize_MEDIUMWIDE: 'Medium wide',
      cardSize_LARGE: 'Large',
      cardSize_LARGETHIN: 'Large thin',
      cardSize_LARGEWIDE: 'Large wide',
    };
    it('should return correct size and dimensions', () => {
      expect(getCardSizeText(CARD_SIZES.SMALL, i18n)).toEqual(
        `${i18n.cardSize_SMALL} (${CARD_DIMENSIONS.SMALL.lg.w}x${CARD_DIMENSIONS.SMALL.lg.h})`
      );
      expect(getCardSizeText(CARD_SIZES.SMALLWIDE, i18n)).toEqual(
        `${i18n.cardSize_SMALLWIDE} (${CARD_DIMENSIONS.SMALLWIDE.lg.w}x${CARD_DIMENSIONS.SMALLWIDE.lg.h})`
      );
      expect(getCardSizeText(CARD_SIZES.MEDIUM, i18n)).toEqual(
        `${i18n.cardSize_MEDIUM} (${CARD_DIMENSIONS.MEDIUM.lg.w}x${CARD_DIMENSIONS.MEDIUM.lg.h})`
      );
      expect(getCardSizeText(CARD_SIZES.MEDIUMTHIN, i18n)).toEqual(
        `${i18n.cardSize_MEDIUMTHIN} (${CARD_DIMENSIONS.MEDIUMTHIN.lg.w}x${CARD_DIMENSIONS.MEDIUMTHIN.lg.h})`
      );
      expect(getCardSizeText(CARD_SIZES.MEDIUMWIDE, i18n)).toEqual(
        `${i18n.cardSize_MEDIUMWIDE} (${CARD_DIMENSIONS.MEDIUMWIDE.lg.w}x${CARD_DIMENSIONS.MEDIUMWIDE.lg.h})`
      );
      expect(getCardSizeText(CARD_SIZES.LARGE, i18n)).toEqual(
        `${i18n.cardSize_LARGE} (${CARD_DIMENSIONS.LARGE.lg.w}x${CARD_DIMENSIONS.LARGE.lg.h})`
      );
      expect(getCardSizeText(CARD_SIZES.LARGETHIN, i18n)).toEqual(
        `${i18n.cardSize_LARGETHIN} (${CARD_DIMENSIONS.LARGETHIN.lg.w}x${CARD_DIMENSIONS.LARGETHIN.lg.h})`
      );
      expect(getCardSizeText(CARD_SIZES.LARGEWIDE, i18n)).toEqual(
        `${i18n.cardSize_LARGEWIDE} (${CARD_DIMENSIONS.LARGEWIDE.lg.w}x${CARD_DIMENSIONS.LARGEWIDE.lg.h})`
      );
    });
  });
});
