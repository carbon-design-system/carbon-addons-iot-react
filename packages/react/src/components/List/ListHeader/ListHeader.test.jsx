import ListHeader from './ListHeader';

describe('ListHeader', () => {
  // TODO: write a test that actually tests the search
  it('ListHeader with defaultProps onChange function', () => {
    expect(ListHeader.defaultProps.search.onChange).toBeDefined();
    ListHeader.defaultProps.search.onChange();
  });
});
