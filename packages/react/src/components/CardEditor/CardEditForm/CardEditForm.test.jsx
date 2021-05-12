import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { CARD_DIMENSIONS, CARD_SIZES, CARD_TYPES } from '../../../constants/LayoutConstants';

import CardEditForm, {
  getCardSizeText,
  handleSubmit,
  hideCardPropertiesForEditor,
} from './CardEditForm';

const mockSetError = jest.fn();
const mockOnChange = jest.fn();
const mockOnCardJsonPreview = jest.fn();
const mockSetShowEditor = jest.fn();
const mockOnValidateCardJson = jest.fn().mockImplementation(() => []);

const cardConfig = {
  title: 'timeSeries',
  size: 'MEDIUM',
  type: 'TIMESERIES',
  content: {
    series: [
      {
        dataItemId: 'torque',
        dataSourceId: 'torque_id',
        label: 'Torque',
      },
    ],
  },
};

afterEach(() => {
  jest.clearAllMocks();
});
describe('CardEditForm', () => {
  describe('CardEditForm', () => {
    it('should fire onCardJsonPreview when opening the json modal', () => {
      render(
        <CardEditForm
          cardConfig={cardConfig}
          onChange={mockOnChange}
          onCardJsonPreview={mockOnCardJsonPreview}
        />
      );
      const openJsonBtn = screen.getByText('Open JSON editor');
      expect(openJsonBtn).toBeInTheDocument();

      fireEvent.click(openJsonBtn);

      expect(mockOnCardJsonPreview).toHaveBeenCalledWith(cardConfig);
    });
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

  // would like to do react-testing-library tests with this, but we're unable to render the actual editor,
  // meaning we can't fire user events on the form
  describe('handleSubmit', () => {
    it('should throw error if JSON is empty', () => {
      handleSubmit('', '', mockSetError, mockOnValidateCardJson, mockOnChange, mockSetShowEditor);
      expect(mockSetError).toBeCalledWith('Unexpected end of JSON input');
    });
    it('should call onChange and setShowEditor if JSON is valid', () => {
      handleSubmit('{}', '', mockSetError, mockOnValidateCardJson, mockOnChange, mockSetShowEditor);
      expect(mockOnChange).toBeCalled();
      expect(mockSetShowEditor).toBeCalledWith(false);
    });
    it('should call onChange with content section changese', () => {
      handleSubmit(
        '{"content":"my content"}',
        '',
        mockSetError,
        mockOnValidateCardJson,
        mockOnChange,
        mockSetShowEditor
      );
      expect(mockOnChange).toBeCalledWith(expect.objectContaining({ content: 'my content' }));
    });
    it('should throw error if JSON is not valid', () => {
      handleSubmit(
        '1234',
        '',
        mockSetError,
        mockOnValidateCardJson,
        mockOnChange,
        mockSetShowEditor
      );
      expect(mockSetError).toBeCalledWith('1234 is not valid JSON');
    });
  });
  describe('hideCardPropertiesForEditor', () => {
    it('should hide properties in the attributes section of a card', () => {
      const sanitizedCard = hideCardPropertiesForEditor({
        type: 'VALUE',
        content: {
          attributes: [
            {
              aggregationMethods: [],
              aggregationMethod: '',
              grain: '',
              dataSourceId: 'torque',
              label: 'Torque',
            },
          ],
        },
      });
      expect(sanitizedCard).toEqual({
        type: 'VALUE',
        content: {
          attributes: [
            {
              aggregationMethod: '',
              dataSourceId: 'torque',
              label: 'Torque',
            },
          ],
        },
      });
    });
    it('should hide properties in the series section of a card', () => {
      const sanitizedCard = hideCardPropertiesForEditor({
        type: 'TIMESERIES',
        content: {
          series: [
            {
              aggregationMethods: [],
              aggregationMethod: '',
              grain: '',
              dataSourceId: 'torque',
              label: 'Torque',
            },
          ],
        },
      });
      expect(sanitizedCard).toEqual({
        type: 'TIMESERIES',
        content: {
          series: [
            {
              aggregationMethod: '',
              dataSourceId: 'torque',
              label: 'Torque',
            },
          ],
        },
      });
    });
    it('should hide properties in the columns section of a card', () => {
      const sanitizedCard = hideCardPropertiesForEditor({
        type: 'TABLE',
        content: {
          columns: [
            {
              aggregationMethods: [],
              aggregationMethod: '',
              grain: '',
              dataSourceId: 'torque',
              label: 'Torque',
            },
          ],
        },
      });
      expect(sanitizedCard).toEqual({
        type: 'TABLE',
        content: {
          columns: [
            {
              aggregationMethod: '',
              dataSourceId: 'torque',
              label: 'Torque',
            },
          ],
        },
      });
    });
    it('should hide properties in the hotspots section of a card', () => {
      const sanitizedCard = hideCardPropertiesForEditor({
        type: 'IMAGE',
        values: {
          hotspots: [
            {
              x: 35,
              y: 65,
              icon: 'InformationFilled24',
              color: 'green',
              content: {
                title: 'My Device',
                description: 'Description',
                attributes: [
                  {
                    dataItemId: 'temperature',
                    dataSourceId: 'temperature',
                    grain: '',
                    aggregationMethods: [],
                    label: 'Temp',
                    precision: 2,
                  },
                ],
              },
            },
          ],
        },
      });
      expect(sanitizedCard).toEqual({
        type: 'IMAGE',
        values: {
          hotspots: [
            {
              x: 35,
              y: 65,
              icon: 'InformationFilled24',
              color: 'green',
              content: {
                title: 'My Device',
                description: 'Description',
                attributes: [
                  {
                    dataItemId: 'temperature',
                    dataSourceId: 'temperature',
                    label: 'Temp',
                    precision: 2,
                  },
                ],
              },
            },
          ],
        },
      });
    });
    it('should hide the content for a custom card', () => {
      const sanitizedCard = hideCardPropertiesForEditor({
        type: 'MY_CUSTOM_TYPE',
        title: 'myCustomCard',
        content: 'Custom card content',
      });
      expect(sanitizedCard).toEqual({
        type: 'MY_CUSTOM_TYPE',
        title: 'myCustomCard',
      });
    });
  });
});
