import { determineCardRange, compareGrains } from '../cardUtilityFunctions';

describe('cardUtilityFunctions', () => {
  test('determineCardRange', () => {
    expect(determineCardRange('last24Hours').type).toEqual('rolling');
    expect(determineCardRange('thisWeek').type).toEqual('periodToDate');
  });
  test('compareGrains', () => {
    expect(compareGrains('day', 'day')).toEqual(0);
    expect(compareGrains('hour', 'day')).toEqual(-1);
    expect(compareGrains('week', 'day')).toEqual(1);
  });
});
