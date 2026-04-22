import { useEffect, useState } from 'react';

const RESIZE_DEBOUNCE_MS = 150;
const POST_RESIZE_SETTLE_MS = 80;
const INITIAL_SETTLE_MS = 80;

/**
 * Resolve the layout node that represents the full horizontal space available
 * for inline actions. Prefer an explicit ref, but fall back to nearby parents
 * so the hook still works when the caller does not provide one.
 */
const getLayoutNode = (layoutRef, container) =>
  layoutRef?.current || container?.parentElement || container?.offsetParent || null;

/**
 * Normalize excluded-width input so the rest of the hook can always work with
 * an array of selectors.
 */
const getExcludedSelectors = (excludedWidthSelector) =>
  Array.isArray(excludedWidthSelector)
    ? excludedWidthSelector
    : [excludedWidthSelector].filter(Boolean);

/**
 * Sum the widths of sibling regions that permanently consume horizontal space,
 * such as selection summary text or a cancel button.
 */
const getExcludedWidth = (layoutNode, selectors) =>
  !layoutNode || !selectors.length
    ? 0
    : selectors.reduce((totalWidth, selector) => {
        const element = layoutNode.querySelector(selector);
        return totalWidth + (element?.offsetWidth || 0);
      }, 0);

/**
 * Compute the width that is actually available for inline actions after fixed
 * sibling regions have been removed.
 */
const getAvailableWidth = (layoutNode, excludedWidth) =>
  layoutNode?.clientWidth ? Math.max(layoutNode.clientWidth - excludedWidth, 0) : 0;

/**
 * Measure all candidate inline action widths from the current DOM. The caller
 * is responsible for keeping hidden items measurable in the DOM.
 */
const getItemWidths = (container, itemSelector) =>
  Array.from(container.querySelectorAll(itemSelector)).map((element, index) => ({
    index,
    width: element.offsetWidth,
  }));

/**
 * Calculate how many inline actions can fit when some width may need to be
 * reserved for the overflow trigger itself.
 */
const calculateFittingInlineCount = ({
  itemWidths,
  containerWidth,
  staticOverflowCount,
  fallbackOverflowWidth,
}) => {
  const totalItemsWidth = itemWidths.reduce((total, item) => total + item.width, 0);

  // Reserve overflow trigger width in either of these cases:
  // - some actions are always forced into overflow
  // - all visible candidates together do not fit inline
  const shouldReserveOverflowSpace =
    staticOverflowCount > 0 || totalItemsWidth + fallbackOverflowWidth > containerWidth;
  const overflowWidth = shouldReserveOverflowSpace ? fallbackOverflowWidth : 0;

  let nextInlineCount = 0;
  let usedWidth = 0;

  for (let index = 0; index < itemWidths.length; index += 1) {
    const remainingItems = itemWidths.length - (index + 1);
    const shouldReserveOverflowWidth =
      staticOverflowCount > 0 || remainingItems > 0 || shouldReserveOverflowSpace;
    const reservedWidth = shouldReserveOverflowWidth ? overflowWidth : 0;

    if (usedWidth + itemWidths[index].width + reservedWidth > containerWidth) {
      break;
    }

    usedWidth += itemWidths[index].width;
    nextInlineCount = index + 1;
  }

  return nextInlineCount;
};

/**
 * Calculate how many inline actions can remain visible before the remaining
 * actions must move into overflow.
 *
 * Measurement strategy:
 * - Use an explicit layout container when available.
 * - Subtract any sibling regions that permanently occupy width
 *   (for example selected-count summary / cancel button).
 * - Measure the natural width of all candidate inline actions.
 * - Reserve overflow trigger width when static overflow exists or when not all
 *   actions can fit inline.
 *
 * Important implementation detail:
 * Items are measured from already-rendered DOM nodes. Hidden inline actions
 * should remain measurable in the DOM; otherwise width calculation will
 * fluctuate between renders.
 *
 * @param {Object} params Hook parameters
 * @param {boolean} params.enabled Whether measurement logic should run
 * @param {Array} params.items Source items represented by rendered DOM nodes
 * @param {React.RefObject<HTMLElement>} params.containerRef Ref to the inline items container
 * @param {React.RefObject<HTMLElement>} params.overflowTriggerRef Ref to the visible overflow trigger container
 * @param {string} params.itemSelector Selector used to find rendered inline item nodes inside the container
 * @param {number} params.staticOverflowCount Count of items that are always rendered in overflow
 * @param {React.RefObject<HTMLElement>} [params.layoutRef] Optional ref to the outer layout container
 * @param {string|string[]} [params.excludedWidthSelector] Selector or selector list for sibling regions whose widths should be excluded from available inline space
 * @param {number} [params.fallbackOverflowWidth=48] Width reserved for the overflow trigger when it is needed
 * @returns {number|null} Number of items that should remain inline, or null when disabled
 */
const useResponsiveInlineCount = ({
  enabled,
  items,
  containerRef,
  overflowTriggerRef,
  itemSelector,
  staticOverflowCount = 0,
  layoutRef = undefined,
  excludedWidthSelector = '',
  fallbackOverflowWidth = 48,
}) => {
  const [inlineCount, setInlineCount] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setInlineCount(null);
      return undefined;
    }

    let frameId = null;
    let settleTimeoutId = null;
    let resizeDebounceTimeoutId = null;
    let postResizeSettleTimeoutId = null;
    let resizeObserver = null;
    const initialContainer = containerRef.current;
    const layoutNode = getLayoutNode(layoutRef, initialContainer);

    const cleanupScheduledWork = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      if (settleTimeoutId) {
        window.clearTimeout(settleTimeoutId);
      }
      if (resizeDebounceTimeoutId) {
        window.clearTimeout(resizeDebounceTimeoutId);
      }
      if (postResizeSettleTimeoutId) {
        window.clearTimeout(postResizeSettleTimeoutId);
      }
    };

    const calculateInlineCount = () => {
      const container = containerRef.current;

      if (!container || !items.length) {
        setInlineCount(items.length);
        return;
      }

      const itemWidths = getItemWidths(container, itemSelector);

      if (!itemWidths.length) {
        setInlineCount(0);
        return;
      }

      const excludedSelectors = getExcludedSelectors(excludedWidthSelector);
      const excludedWidth = getExcludedWidth(layoutNode, excludedSelectors);

      // Available inline width comes from the outer layout width after removing
      // regions that permanently consume horizontal space.
      const containerWidth = getAvailableWidth(layoutNode, excludedWidth);

      if (!containerWidth) {
        setInlineCount(items.length);
        return;
      }

      const nextInlineCount = calculateFittingInlineCount({
        itemWidths,
        containerWidth,
        staticOverflowCount,
        fallbackOverflowWidth,
      });

      setInlineCount((previousCount) =>
        previousCount === nextInlineCount ? previousCount : nextInlineCount
      );
    };

    const scheduleCalculation = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      frameId = requestAnimationFrame(calculateInlineCount);
    };

    scheduleCalculation();
    settleTimeoutId = window.setTimeout(() => {
      scheduleCalculation();
    }, INITIAL_SETTLE_MS);

    const debounceCalculation = () => {
      if (resizeDebounceTimeoutId) {
        window.clearTimeout(resizeDebounceTimeoutId);
      }
      if (postResizeSettleTimeoutId) {
        window.clearTimeout(postResizeSettleTimeoutId);
      }

      resizeDebounceTimeoutId = window.setTimeout(() => {
        scheduleCalculation();
        postResizeSettleTimeoutId = window.setTimeout(() => {
          scheduleCalculation();
        }, POST_RESIZE_SETTLE_MS);
      }, RESIZE_DEBOUNCE_MS);
    };

    const handleResize = () => {
      debounceCalculation();
    };

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        debounceCalculation();
      });

      if (layoutNode) {
        resizeObserver.observe(layoutNode);
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      cleanupScheduledWork();
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [
    containerRef,
    enabled,
    excludedWidthSelector,
    fallbackOverflowWidth,
    itemSelector,
    items,
    layoutRef,
    overflowTriggerRef,
    staticOverflowCount,
  ]);

  return inlineCount;
};

export default useResponsiveInlineCount;

// Made with Bob
