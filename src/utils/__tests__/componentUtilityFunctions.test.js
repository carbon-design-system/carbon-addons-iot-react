import { getSortedData, canFit, filterValidAttributes } from '../componentUtilityFunctions';

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
  test('canFit', () => {
    expect(canFit(0, 0, 1, 1, [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])).toEqual(
      false
    );
    expect(canFit(0, 0, 1, 1, [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])).toEqual(
      true
    );
  });
  test('filterValidAttributes allow HTML attributes, event handlers, react lib', () => {
    // HTML
    expect(filterValidAttributes({ alt: 'my alt text', draggable: 'true' })).toEqual({
      alt: 'my alt text',
      draggable: 'true',
    });
    // Event handlers
    expect(filterValidAttributes({ onClick: 'f', onDragExit: 'f' })).toEqual({
      onClick: 'f',
      onDragExit: 'f',
    });
    // React
    expect(filterValidAttributes({ ref: 'f', autoFocus: 'f' })).toEqual({
      ref: 'f',
      autoFocus: 'f',
    });
    // Aria- & data- attributes
    expect(filterValidAttributes({ 'aria-x': 'test', 'data-x': 'test2' })).toEqual({
      'aria-x': 'test',
      'data-x': 'test2',
    });
    // Other props
    expect(filterValidAttributes({ myProp: 'test', someProp: 'test2' })).toEqual({});
  });
});
