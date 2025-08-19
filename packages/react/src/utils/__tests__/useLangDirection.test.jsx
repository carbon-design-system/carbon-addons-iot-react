import { renderHook, act } from '@testing-library/react-hooks';

import { useLangDirection } from '../useLangDirection';

describe('useLangDirection', () => {
  // Save the original document.getElementsByTagName implementation
  const originalGetElementsByTagName = document.getElementsByTagName;

  // Mock HTML element with dir attribute
  let mockHtmlElement;

  beforeEach(() => {
    // Create a mock HTML element
    mockHtmlElement = {
      getAttribute: jest.fn().mockImplementation((attr) => {
        if (attr === 'dir') return 'ltr';
        return null;
      }),
      setAttribute: jest.fn().mockImplementation((attr, value) => {
        if (attr === 'dir') mockHtmlElement.dir = value;
      }),
      dir: 'ltr',
    };

    // Mock document.getElementsByTagName to return our mock element
    document.getElementsByTagName = jest.fn().mockImplementation((tag) => {
      if (tag === 'html') return [mockHtmlElement];
      return originalGetElementsByTagName.call(document, tag);
    });

    // Mock MutationObserver
    global.MutationObserver = class {
      constructor(callback) {
        this.callback = callback;
        this.observe = jest.fn();
        this.disconnect = jest.fn();
      }

      // Helper method to simulate mutations
      triggerMutation(mutations) {
        this.callback(mutations);
      }
    };
  });

  afterEach(() => {
    // Restore the original implementation
    document.getElementsByTagName = originalGetElementsByTagName;
    delete global.MutationObserver;
  });

  it('should return "ltr" as the default direction', () => {
    const { result } = renderHook(() => useLangDirection());
    expect(result.current).toBe('ltr');
  });

  it('should return the direction from the HTML element', () => {
    // Set up the mock to return 'rtl'
    mockHtmlElement.getAttribute = jest.fn().mockReturnValue('rtl');

    const { result } = renderHook(() => useLangDirection());
    expect(result.current).toBe('rtl');
  });

  it('should return "ltr" if the HTML element has no dir attribute', () => {
    // Set up the mock to return null (no dir attribute)
    mockHtmlElement.getAttribute = jest.fn().mockReturnValue(null);

    const { result } = renderHook(() => useLangDirection());
    expect(result.current).toBe('ltr');
  });

  it('should update when the dir attribute changes', () => {
    // Initial render with 'ltr'
    mockHtmlElement.getAttribute = jest.fn().mockReturnValue('ltr');
    const { result } = renderHook(() => useLangDirection());
    expect(result.current).toBe('ltr');

    // Get the MutationObserver instance
    const observer = global.MutationObserver.mock.instances[0];

    // Simulate a mutation of the dir attribute to 'rtl'
    act(() => {
      // Update the mock to return 'rtl' for future calls
      mockHtmlElement.getAttribute = jest.fn().mockReturnValue('rtl');

      // Simulate a mutation
      observer.triggerMutation([
        {
          type: 'attributes',
          attributeName: 'dir',
          oldValue: 'ltr',
          target: mockHtmlElement,
        },
      ]);
    });

    // Check that the hook returned the new direction
    expect(result.current).toBe('rtl');
  });

  it('should not update when a different attribute changes', () => {
    // Initial render with 'ltr'
    mockHtmlElement.getAttribute = jest.fn().mockReturnValue('ltr');
    const { result } = renderHook(() => useLangDirection());
    expect(result.current).toBe('ltr');

    // Get the MutationObserver instance
    const observer = global.MutationObserver.mock.instances[0];

    // Simulate a mutation of a different attribute
    act(() => {
      observer.triggerMutation([
        {
          type: 'attributes',
          attributeName: 'class',
          oldValue: '',
          target: mockHtmlElement,
        },
      ]);
    });

    // Direction should not change
    expect(result.current).toBe('ltr');
  });

  it('should disconnect the observer when the component unmounts', () => {
    const { unmount } = renderHook(() => useLangDirection());

    // Get the MutationObserver instance
    const observer = global.MutationObserver.mock.instances[0];

    // Unmount the hook
    unmount();

    // Check that disconnect was called
    expect(observer.disconnect).toHaveBeenCalled();
  });

  it('should return "ltr" in server-side rendering', () => {
    // Mock window and document as undefined to simulate SSR
    const originalWindow = global.window;
    const originalDocument = global.document;

    delete global.window;
    delete global.document;

    const { result } = renderHook(() => useLangDirection());

    // Should return 'ltr' in SSR
    expect(result.current).toBe('ltr');

    // Restore window and document
    global.window = originalWindow;
    global.document = originalDocument;
  });
});

// Made with Bob
