import { renderHook, act } from '@testing-library/react-hooks';
import React from 'react';

import useVisibilityObserver from './useVisibilityObserver';

const ref = React.createRef();
ref.current = document.createElement('div');
const onChange = jest.fn();
const observer = {
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
};
let observerCallback;
let isIntersecting = false;

describe('useVisibilityObserver', () => {
  const { IntersectionObserver: originalIntersectionObserver } = window;
  beforeEach(() => {
    window.IntersectionObserver = jest.fn().mockImplementation((cb) => {
      // save the callback so we can manually trigger it again as if the element
      // became visible on the screen
      observerCallback = cb;
      cb([{ isIntersecting }], observer);
      return observer;
    });
  });

  afterEach(() => {
    isIntersecting = false;
    window.IntersectionObserver = originalIntersectionObserver;
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('should unobserve and only fire onChange once when unobserveAfterVisible:true', () => {
    const initialProps = [
      ref,
      {
        unobserveAfterVisible: true,
        onChange,
      },
    ];
    const { result, rerender } = renderHook(
      ([elementRef, options]) => useVisibilityObserver(elementRef, options),
      {
        initialProps,
      }
    );

    // the initial render should observe the ref one time
    expect(observer.observe).toHaveBeenCalledWith(ref.current);
    expect(observer.observe).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual([false]);
    expect(onChange).not.toHaveBeenCalled();

    // // mock the observer calling the callback when the element is visible,
    // // in testing this triggers the useEffect cleanup, so observe will be called again
    act(() => {
      isIntersecting = true;
      observerCallback([{ isIntersecting }], observer);
    });
    expect(observer.observe).toHaveBeenCalledWith(ref.current);
    expect(observer.observe).toHaveBeenCalledTimes(1);

    expect(onChange).toHaveBeenCalledWith({ isVisible: true });
    rerender(initialProps);
    expect(result.current).toEqual([true]);

    // unobserve should be called once because the element is now visible, and should not be observed
    // anymore since unobserveAfterVisible is true
    expect(observer.unobserve).toHaveBeenCalledTimes(1);
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });

  it('should continue to observe all changes when unobserveAfterVisible:false', () => {
    const initialProps = [ref, { unobserveAfterVisible: false, onChange }];
    const { result } = renderHook(
      ([elementRef, options]) => useVisibilityObserver(elementRef, options),
      {
        initialProps,
      }
    );

    // the initial render should observe the ref one time
    expect(observer.observe).toHaveBeenCalledWith(ref.current);
    expect(observer.observe).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual([false]);
    expect(onChange).not.toHaveBeenCalled();

    // mock the observer calling the callback when the element is visible
    act(() => {
      isIntersecting = true;
      observerCallback([{ isIntersecting }], observer);
    });

    expect(observer.observe).toHaveBeenCalledTimes(1);
    expect(observer.unobserve).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith({ isVisible: true });
    expect(result.current).toEqual([true]);

    // unobserve should not be called because the element is now visible, but we're still observing it
    expect(observer.unobserve).not.toHaveBeenCalled();
    expect(observer.disconnect).not.toHaveBeenCalled();

    // mock the observer calling the callback when the element is hidden again
    act(() => {
      isIntersecting = false;
      observerCallback([{ isIntersecting }], observer);
    });

    expect(observer.unobserve).not.toHaveBeenCalled();
    expect(observer.disconnect).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith({ isVisible: false });
    expect(result.current).toEqual([false]);
  });

  it('should disconnect the existing and create a new observer when the ref changes', () => {
    const initialProps = [ref, { onChange }];
    const { result, rerender } = renderHook(
      ([elementRef, options]) => useVisibilityObserver(elementRef, options),
      {
        initialProps,
      }
    );

    // the initial render should observe the ref one time
    expect(observer.observe).toHaveBeenCalledWith(ref.current);
    expect(observer.observe).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual([false]);
    expect(onChange).not.toHaveBeenCalled();

    const newRef = React.createRef();
    newRef.current = document.createElement('div');
    rerender([newRef, initialProps[1]]);

    expect(observer.unobserve).not.toHaveBeenCalled();
    expect(observer.observe).toHaveBeenCalledTimes(2);
    expect(observer.disconnect).toHaveBeenCalledTimes(2);
  });
});
