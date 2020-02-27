import { CARD_SIZES } from '../../constants/LayoutConstants';

import { findLayoutOrGenerate } from './DashboardGrid';

jest.mock('../../utils/componentUtilityFunctions.js'); // this happens automatically with automocking
const componentUtilityFunctions = require('../../utils/componentUtilityFunctions.js');

describe('DashboardGrid', () => {
  test('findLayoutOrGenerate', () => {
    // if no layouts exist they should be generated
    findLayoutOrGenerate({}, [{ id: 'mycard', size: CARD_SIZES.MEDIUM }]);
    expect(componentUtilityFunctions.getLayout).toHaveBeenCalled();
    componentUtilityFunctions.getLayout.mockClear();
    // if layout is missing card it should be regenerated
    findLayoutOrGenerate({ max: [], xl: [], lg: [], md: [], sm: [], xs: [] }, [
      { id: 'mycard', size: CARD_SIZES.MEDIUM },
    ]);
    expect(componentUtilityFunctions.getLayout).toHaveBeenCalled();
    componentUtilityFunctions.getLayout.mockClear();
    // if every layout already exists, the card should have dimensions added
    const newLayouts = findLayoutOrGenerate(
      {
        max: [{ i: 'mycard', x: 0, y: 0 }],
        xl: [{ i: 'mycard', x: 0, y: 0 }],
        lg: [{ i: 'mycard', x: 0, y: 0 }],
        md: [{ i: 'mycard', x: 0, y: 0 }],
        sm: [{ i: 'mycard', x: 0, y: 0 }],
        xs: [{ i: 'mycard', x: 0, y: 0 }],
      },
      [{ id: 'mycard', size: CARD_SIZES.MEDIUM }]
    );
    expect(componentUtilityFunctions.getLayout).not.toHaveBeenCalled();
    expect(newLayouts.max[0]).toHaveProperty('w');
    expect(newLayouts.max[0]).toHaveProperty('h');
    // handle old layouts with bogus cards
    const emptyLayouts = findLayoutOrGenerate(
      {
        max: [{ i: 'boguscard', x: 0, y: 0 }, { i: 'mycard', x: 0, y: 0 }],
        xl: [{ i: 'boguscard', x: 0, y: 0 }],
        lg: [{ i: 'boguscard', x: 0, y: 0 }],
        md: [{ i: 'boguscard', x: 0, y: 0 }],
        sm: [{ i: 'boguscard', x: 0, y: 0 }],
        xs: [{ i: 'boguscard', x: 0, y: 0 }],
      },
      [{ id: 'mycard', size: CARD_SIZES.MEDIUM }]
    );
    // the bogus card was quietly removed from the layout
    expect(emptyLayouts.max).toHaveLength(1);
  });
});
