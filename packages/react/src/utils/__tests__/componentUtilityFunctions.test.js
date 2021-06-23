import {
  getSortedData,
  canFit,
  getLayout,
  filterValidAttributes,
  generateCsv,
  convertStringsToDOMElement,
} from '../componentUtilityFunctions';
import { CARD_DIMENSIONS, DASHBOARD_COLUMNS } from '../../constants/LayoutConstants';

const mockData = [
  { values: { number: 10, string: 'string', null: 1 } },
  { values: { number: 100, string: 'string2' } },
  { values: { number: 20, string: 'string3', null: 3 } },
];

const mockCsvData = [
  {
    id: 'row-1',
    values: {
      alert: 'AHI003 process need to optimize adjust X variables',
      count: 1.10329291,
      pressure: 0,
    },
    isSelectable: false,
  },
  {
    id: 'row-1',
    values: {
      alert: 'AHI003 process need to optimize adjust X variables',
      count: 1.10329291,
      pressure: 2,
    },
    isSelectable: false,
  },
  {
    id: 'row-1',
    values: {
      alert: 'AHI003 process need to optimize adjust X variables',
      count: 1.10329291,
    },
    isSelectable: false,
  },
];

describe('componentUtilityFunctions', () => {
  it('getSortedData', () => {
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
  it('canFit', () => {
    expect(
      canFit(0, 0, 1, 1, [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ])
    ).toEqual(false);
    expect(
      canFit(0, 0, 1, 1, [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ])
    ).toEqual(true);
  });
  describe('getLayout', () => {
    it('Should generate new a layout for each card', () => {
      // Current breakpoint
      const layoutName = 'lg';
      const cards = [
        { id: 1, content: {}, size: 'MEDIUM' },
        { id: 2, content: {}, size: 'MEDIUM' },
        { id: 3, content: {}, size: 'LARGE' },
      ];
      // Only give a layout for the first card
      const existingLayout = [{ i: 1, x: 2, y: 2 }];
      const layout = getLayout(
        layoutName,
        cards,
        DASHBOARD_COLUMNS,
        CARD_DIMENSIONS,
        existingLayout
      );
      // Should generate a layout for all 3 cards
      expect(layout).toEqual([
        { i: 1, h: 2, w: 8, x: 2, y: 2 },
        { i: 2, h: 2, w: 8, x: 0, y: 0 },
        { i: 3, h: 4, w: 8, x: 0, y: 4 },
      ]);
    });
    it('Should throw a console.error if layout is bad', () => {
      // Spy on the console to make sure we throw our error
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const layoutName = 'md';
      const cards = [
        { id: 1, content: {}, size: 'MEDIUM' },
        { id: 2, content: {}, size: 'MEDIUM' },
        { id: 3, content: {}, size: 'LARGE' },
      ];
      // This layout is bad because a MEDIUM card would not fit at a 'md'
      // breakpoint if it was set with an x offset of x: 2.
      // A MEDIUM card has a width of 8 units, so if you set it at x: 2 it
      // will attempt to be placed outside of the bounds of the 'md' breakpoint which is
      // 8 units wide as well.
      const existingLayout = [{ i: 1, x: 2, y: 2 }];
      const mdLayout = getLayout(
        layoutName,
        cards,
        DASHBOARD_COLUMNS,
        CARD_DIMENSIONS,
        existingLayout
      );
      // This should throw a console error that the layout is bad, but not fail the test as react-grid-layout will fix it for us
      expect(mdLayout).toEqual([
        { h: 2, i: 1, w: 8, x: 2, y: 2 },
        { h: 2, i: 2, w: 8, x: 0, y: 0 },
        { h: 4, i: 3, w: 8, x: 0, y: 4 },
      ]);
      expect(console.error).toHaveBeenCalled();
      console.error.mockClear();
    });
  });
  it('filterValidAttributes allow HTML attributes, event handlers, react lib', () => {
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
  it('csv should display 0 value', () => {
    const csv = generateCsv(mockCsvData);
    const splitCsv = csv.split(',');

    // The 0 should appear as the last value in the first row
    expect(splitCsv[4]).toEqual('0');
  });
});

describe('convertStringsToDOMElement', () => {
  it('accepts, converts, and returns single DOM node wrapped in body', () => {
    const [element] = convertStringsToDOMElement(['<div></div>']);
    expect(element.tagName).toBe('BODY');
    expect(element.querySelectorAll('div').length).toBe(1);
    expect(element instanceof Element).toBe(true);
  });
  it('accepts, converts, and returns multiple DOM nodes', () => {
    const [nestedStructure, hasAttribute] = convertStringsToDOMElement([
      '<div><ul><li>one</li><li>two</li></ul></div>',
      '<a href="ibm.com">IBM</a>',
    ]);

    const listItems = nestedStructure.querySelectorAll('li');
    expect(listItems.length).toBe(2);
    expect(listItems[0].innerHTML).toBe('one');
    expect(listItems[0].parentElement.tagName).toBe('UL');
    expect(listItems[0].parentElement.parentElement.tagName).toBe('DIV');

    expect(hasAttribute.querySelector('a').hasAttribute('href')).toBe(true);
  });
  it('returns undefined on empty array', () => {
    const [element] = convertStringsToDOMElement([]);
    expect(element).toBeUndefined();
  });
  it('handles text as a parameter', () => {
    const [element] = convertStringsToDOMElement(['just a string']);
    expect(element.firstChild.textContent).toBe('just a string');
  });
});
