import { determineCardRange, compareGrains, getUpdatedCardSize } from '../cardUtilityFunctions';

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
  test('GetUpdatedCardSize', () => {
    expect(getUpdatedCardSize('XSMALL')).toEqual('SMALL');
    expect(getUpdatedCardSize('XSMALLWIDE')).toEqual('SMALLWIDE');
    expect(getUpdatedCardSize('WIDE')).toEqual('MEDIUMWIDE');
    expect(getUpdatedCardSize('TALL')).toEqual('LARGETHIN');
    expect(getUpdatedCardSize('XLARGE')).toEqual('LARGEWIDE');
    expect(getUpdatedCardSize('MEDIUM')).toEqual('MEDIUM');
  });
});
