import { renderHook } from '@testing-library/react-hooks';
import * as lodash from 'lodash-es/merge';

import useMerged from './useMerged';

describe('useMerged', () => {
  let mergeSpy;
  beforeEach(() => {
    mergeSpy = jest.spyOn(lodash, 'default');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('useMemo should only be called when props change', () => {
    const props = [{ foo: 'bar', bar: 'baz' }, { foo: 'foobar' }];
    const { result, rerender } = renderHook((args) => useMerged(args[0], args[1]), {
      initialProps: props,
    });
    expect(result.current).toEqual({ foo: 'foobar', bar: 'baz' });
    expect(mergeSpy).toHaveBeenCalledTimes(1);

    // rerender using the same props
    rerender(props);
    expect(result.current).toEqual({ foo: 'foobar', bar: 'baz' });
    expect(mergeSpy).toHaveBeenCalledTimes(1);

    // render with changes props to ensure that useMemo is called again.
    rerender([
      { foo: 'bar', bar: 'baz' },
      { foo: 'foobar', bar: 'barbaz' },
    ]);
    expect(result.current).toEqual({ foo: 'foobar', bar: 'barbaz' });
    expect(mergeSpy).toHaveBeenCalledTimes(2);
  });
});
