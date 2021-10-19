import { defaultAbsoluteValue, defaultRelativeValue } from './DateTimePicker.story';
import { parseValue } from './dateTimePickerUtils';

describe('dateTimePickerUtils', () => {
  describe('parseValue', () => {
    it('should return a blank readableValue if no value given', () => {
      expect(parseValue(undefined)).toEqual({ readableValue: '' });
    });

    it('should return a blank readableValue if unexpected value given', () => {
      expect(parseValue({})).toEqual({ readableValue: '' });
    });

    it('should parse absolute default DateTimePicker values', () => {
      expect(parseValue(defaultAbsoluteValue, 'YYYY-MM-DD HH:mm', 'to')).toEqual({
        ...defaultAbsoluteValue,
        absolute: {
          end: expect.any(Date),
          start: expect.any(Date),
        },
        readableValue: '2020-04-01 12:34 to 2020-04-06 10:49',
      });
    });

    it('should parse relative default DateTimePicker values', () => {
      expect(parseValue(defaultRelativeValue, 'YYYY-MM-DD HH:mm', 'to')).toEqual({
        ...defaultRelativeValue,
        relative: {
          end: expect.any(Date),
          start: expect.any(Date),
        },
        readableValue: '2018-09-21 13:10 to 2018-09-21 13:30',
      });
    });
  });
});
