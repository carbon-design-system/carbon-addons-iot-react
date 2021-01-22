import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';

import { determineLayout } from './valueCardUtils';

describe('valueCardUtils', () => {
  describe('determineLayout', () => {
    it('should return horizontal layout', () => {
      expect(determineLayout(CARD_SIZES.SMALL)).toBe(CARD_LAYOUTS.HORIZONTAL);
      expect(determineLayout(CARD_SIZES.SMALLWIDE)).toBe(CARD_LAYOUTS.HORIZONTAL);
      expect(determineLayout('some unsupported card size')).toBe(CARD_LAYOUTS.HORIZONTAL);
    });

    it('should return vertical layout', () => {
      expect(determineLayout(CARD_SIZES.MEDIUM)).toBe(CARD_LAYOUTS.VERTICAL);
      expect(determineLayout(CARD_SIZES.MEDIUMTHIN)).toBe(CARD_LAYOUTS.VERTICAL);
      expect(determineLayout(CARD_SIZES.MEDIUMWIDE)).toBe(CARD_LAYOUTS.VERTICAL);
      expect(determineLayout(CARD_SIZES.LARGE)).toBe(CARD_LAYOUTS.VERTICAL);
      expect(determineLayout(CARD_SIZES.LARGETHIN)).toBe(CARD_LAYOUTS.VERTICAL);
      expect(determineLayout(CARD_SIZES.LARGEWIDE)).toBe(CARD_LAYOUTS.VERTICAL);
    });
  });
});
