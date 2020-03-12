import { getSortedData, canFit } from '../componentUtilityFunctions';

const mockData = [
  { values: { number: 10, string: 'string', null: 1 } },
  { values: { number: 100, string: 'string2' } },
  { values: { number: 20, string: 'string3', null: 3 } },
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
    expect(getSortedData(mockData, 'null', 'ASC')[0].values.null).toEqual(1);
    expect(getSortedData(mockData, 'null', 'ASC')[1].values.null).toEqual(3);
    expect(getSortedData(mockData, 'null', 'ASC')[2].values.null).toBeUndefined();
  });
  test('canFit', () => {
    expect(canFit(0, 0, 1, 1, [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])).toEqual(
      false
    );
    expect(canFit(0, 0, 1, 1, [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])).toEqual(
      true
    );
  });
});
