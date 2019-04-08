import { getSortedData } from '../componentUtilityFunctions';

const mockData = [
  { values: { number: 10, string: 'string', null: null } },
  { values: { number: 100, string: 'string2', null: null } },
  { values: { number: 20, string: 'string3', null: null } },
];

describe('componentUtilityFunctions', () => {
  test('getSortedData', () => {
    expect(getSortedData(mockData, 'string', 'DESC')[0].values.string).toEqual('string3');
    expect(getSortedData(mockData, 'string', 'ASC')[0].values.string).toEqual('string');
    expect(getSortedData(mockData, 'number', 'DESC')[0].values.number).toEqual(100);
    expect(getSortedData(mockData, 'number', 'DESC')[1].values.number).toEqual(20);
    expect(getSortedData(mockData, 'number', 'DESC')[2].values.number).toEqual(10);
    expect(getSortedData(mockData, 'number', 'ASC')[0].values.number).toEqual(10);
    expect(getSortedData(mockData, 'number', 'ASC')[1].values.number).toEqual(20);
    expect(getSortedData(mockData, 'number', 'ASC')[2].values.number).toEqual(100);
  });
});
