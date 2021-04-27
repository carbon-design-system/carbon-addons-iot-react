import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';

import { determineLayout, determineMaxValueCardAttributeCount } from './valueCardUtils';

describe('valueCardUtils', () => {
  describe('determineLayout', () => {
    it('should return horizontal layout', () => {
      expect(determineLayout(CARD_SIZES.SMALL)).toBe(CARD_LAYOUTS.HORIZONTAL);
      expect(determineLayout(CARD_SIZES.SMALLWIDE)).toBe(CARD_LAYOUTS.HORIZONTAL);
      expect(determineLayout(CARD_SIZES.SMALLFULL)).toBe(CARD_LAYOUTS.HORIZONTAL);
      expect(determineLayout(CARD_SIZES.MEDIUMWIDE)).toBe(CARD_LAYOUTS.HORIZONTAL);
      expect(determineLayout('some unsupported card size')).toBe(CARD_LAYOUTS.HORIZONTAL);
    });

    it('should return vertical layout', () => {
      expect(determineLayout(CARD_SIZES.MEDIUM)).toBe(CARD_LAYOUTS.VERTICAL);
      expect(determineLayout(CARD_SIZES.MEDIUMTHIN)).toBe(CARD_LAYOUTS.VERTICAL);
      expect(determineLayout(CARD_SIZES.LARGE)).toBe(CARD_LAYOUTS.VERTICAL);
      expect(determineLayout(CARD_SIZES.LARGETHIN)).toBe(CARD_LAYOUTS.VERTICAL);
      expect(determineLayout(CARD_SIZES.LARGEWIDE)).toBe(CARD_LAYOUTS.VERTICAL);
    });

    /**
     * This method is deprecated. Just adding to increase testing coverage on the file
     * until it is removed in the next major release
     */
    it('should return the correct attribute count', () => {
      expect(determineMaxValueCardAttributeCount(CARD_SIZES.SMALL, 2)).toBe(1);
      expect(determineMaxValueCardAttributeCount(CARD_SIZES.SMALLWIDE, 3)).toBe(2);
      expect(determineMaxValueCardAttributeCount(CARD_SIZES.MEDIUM, 4)).toBe(3);
      expect(determineMaxValueCardAttributeCount(CARD_SIZES.MEDIUMTHIN, 4)).toBe(3);
      expect(determineMaxValueCardAttributeCount(CARD_SIZES.SMALLFULL, 5)).toBe(4);
      expect(determineMaxValueCardAttributeCount(CARD_SIZES.MEDIUMWIDE, 5)).toBe(4);
      expect(determineMaxValueCardAttributeCount(CARD_SIZES.LARGE, 6)).toBe(5);
      expect(determineMaxValueCardAttributeCount(CARD_SIZES.LARGETHIN, 6)).toBe(7);
      expect(determineMaxValueCardAttributeCount(CARD_SIZES.LARGEWIDE, 10)).toBe(7);
      expect(determineMaxValueCardAttributeCount('AN_UNKNOWN_SIZE', 10)).toBe(10);

      const originalDEV = global.__DEV__;
      const originalError = console.error;

      global.__DEV__ = true;
      console.error = jest.fn();
      expect(determineMaxValueCardAttributeCount(CARD_SIZES.LARGEWIDE, 10)).toBe(7);
      expect(console.error).toBeCalledWith(
        `Warning: Deprecation warning: There is no longer a max number of attributes allowed in ValueCards. This function will me removed in the next release.`
      );
      global.__DEV__ = originalDEV;
      console.error = originalError;
    });
  });
});
