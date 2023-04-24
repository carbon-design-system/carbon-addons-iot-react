import React, { useEffect, useState, useRef, useCallback } from 'react';

import { settings } from '../../../constants/Settings';
import { tableTraverser } from '../tableUtilities';

import { TableDropRowOverlay } from './TableBodyRow/TableDropRowOverlay';
import { TableDragAvatar } from './TableDragAvatar';

const { prefix, iotPrefix } = settings;

/**
 * This is similar to `useState` but pairs the value with a ref to the value. The benefit of this is
 * that callback functions do not need to include refs in their dependency lists, but can access
 * their most recent values safely.
 *
 * This is important for some data used in manually added event listeners, like for "mousemove". If
 * listeners depend on normal state, they must be removed and added frequently to create a closure
 * around the new state. But by using a ref they only need to close around the mutable ref, then use
 * that to access the value they needs. For drag and drop, we need to ensure there are no
 * dependencies that would cause the `setupDnd` effect to tear down and set up repeatedly since they
 * will cause visual and performance problems.
 *
 * Note that this still returns a stateful value along with the ref. That normal state value should
 * be used for any traditional reactive updates.
 *
 * @param {any} initialValue Initial value to set. Omit to start with `undefined`.
 * @returns 3 item tuple of: reference to the value, the stateful value, and function to update both
 * of them. The setter does trigger a state update and potential rerender.
 */
function useRefAndState(initialValue) {
  const [value, setValue] = useState(initialValue);
  const ref = useRef(initialValue);

  const setter = useCallback((newValue) => {
    ref.current = newValue;
    setValue(newValue);
  }, []);

  return [ref, value, setter];
}
/**
 * If there is a vertical scroll bar on the document and in RTL mode then this returns its width.
 * Otherwise, returns 0.
 *
 * In RTL `getBoundingClientRect` is relative to the window edge, but pos:abs elements are relative
 * to the left-side, vertical scrollbar (if there is one). That means the positioned elements might
 * be shifted over by the vertical scrollbar width. This gets the width if relevant so it can be
 * subtracted out in some values.
 */

function getRtlVerticalScrollbarWidth() {
  /* istanbul ignore next */ // ignore rlt
  return document.dir === 'rtl' ? window.innerWidth - document.documentElement.clientWidth : 0;
}

/**
 * Event handlers to mix into the table and state variables about the current drag and drop
 * operation.
 *
 * @typedef {Object} UseTableDndResult
 * @property {boolean} isDragging If a drag is in progress.
 * @property {ReactNode} dragPreview A element that must be rendered as a child of the page body.
 * This is the image that's shown during a drag and follows the mouse.
 * @property {string} activeDropRowId The row a drag is hovering over and might drop on.
 * @property {Set<string>} canDropRowIds The row IDs that can be dropped on. These were given by the
 * caller from the `onDrag` callback.
 * @property {string[]} dragRowIds The rows that are being dragged.
 * @property {(MouseEvent) => void} handleEnterRow - Event handler that must be added as a
 * "mouseenter" listener to the table rows.
 * @property {(MouseEvent) => void} handleLeaveRow Event handler that must be added as a
 * "mouseleave" listener to the table rows.
 * @property {(MouseEvent) => void} handleStartPossibleDrag Event handler that must be added as a
 * "mousedown" listener on the all drag handles of the table rows.
 */

/**
 * Sets up a PAL table for drag and drop support.
 *
 * This is is hook purely to move this code into its own file. This is coupled with `TableBody` and
 * only makes sense using it there.
 *
 * @param {object[]} rows The rows of the table we're dragging in.
 * @param {string[]} selectedIds The currently selected row IDs or empty array.
 * @param {number | undefined} Optional minimum z-index for the drag image. Required if the table is
 * in a modal with a >0 z-index.
 * @param {(object[]) -> {preview: ReactNode, dropIds: string[]}} onDrag Callback fires when a drag
 * actually start. This passes the the table rows being dragged. It must return a tuple of a
 * ReactNode to show as the drag image and a list of row IDs that can accept a drop from the given
 * dragged row ID.
 * @param {(string[], string) => void} onDrop Callback when a drop succeeds. Passes the IDs of the
 * rows being dragged and the ID of the row being dropped on.
 * @returns {UseTableDndResult} Values to mix into the table.
 */
function useTableDnd(rows, selectedIds, zIndex, onDrag, onDrop) {
  // These are related. When the user "mousedown"s on a drag handle, we consider it a "possible"
  // drag. At this point we add all the event listeners to track the drag. Put only after they move
  // past some threshold do we actually set `isDragging`. At that point the drag is "real" and we'll
  // fire the onDrag callback and draw the drag image.
  const [isPossibleDrag, setIsPossibleDrag] = useState(false);
  const [isDraggingRef, isDragging, setIsDragging] = useRefAndState(false);

  // The row being dragged
  const [dragRowIdsRef, dragRowIds, setDragRowIds] = useRefAndState([]);

  // The rows that CAN be dropped on, but we're not necessarily over them right now. The caller
  // provides these from the onDrag callback.
  const [canDropRowIds, setCanDropRowIds] = useState(new Set());

  // The drag preview we show under the cursors when dragging. The caller constructs this for use in
  // the onDrag callback.
  const [dragPreview, setDragPreview] = useState(null);
  const avatarRef = useRef(null);

  // The row ID we're hovering over during a drag. Only if it accepts a drop. Note there is a state
  // and ref for the same value. See setActiveDropRowId.
  const activeDropRowIdRef = useRef(null);

  //  The coords where a DnD starts from. Not a state change, just used later in response to mousemove.
  const dragStartCoordsRef = useRef();

  /**
   * After a failed drag (canceled or not over a good row) this animates the avatar back into its
   * original position to show that the drop did not succeed.
   */
  function snapBackAvatar() {
    if (avatarRef.current) {
      /* istanbul ignore next */
      avatarRef.current.ontransitionend = () => setDragPreview(null);
      avatarRef.current.style.transition = 'transform 200ms';
      avatarRef.current.style.transform = `translate(${document.documentElement.scrollLeft}px, ${document.documentElement.scrollTop}px)`;
    }
  }

  const handleDrop = useCallback(
    /**
     * Called when a drop occurs. Ends the drag operations and fires the `onDrop` callback if over a
     * row that can be dropped on.
     */
    function handleDrop(e) {
      e.stopPropagation();

      if (activeDropRowIdRef.current == null) {
        snapBackAvatar();
      } else {
        // Notify of success. Protect from caller errors.
        onDrop(dragRowIds, activeDropRowIdRef.current);
        setDragPreview(null);
      }
      setIsPossibleDrag(false);
    },
    [activeDropRowIdRef, onDrop, dragRowIds]
  );

  const badMoveCountRef = useRef(0);

  const handleDragMove = useCallback(
    /**
     * Event handler when the mouse moves during a drag. This actually starts the real drag once the
     * mouse has moved past a threshold. Throughout the drag, updates the drag avatar position. This
     * does not track what row we're over--`handleEnterRow` know that from onmouseenter events.
     *
     * @param {React.MouseEvent} e
     */
    function handleDragMove(e) {
      if (e.buttons === 0) {
        badMoveCountRef.current += 1;
        if (badMoveCountRef.current >= 10) {
          // If the mouse goes outside the window and releases the button then the mouseup is missed
          // and the drag is stuck. If we see a few moves without a mouse button down then that's
          // probably the case. We don't do this on the first bad move since Safari and Firefox on
          // macOS can fire a mousemove without buttons BEFORE a mouse up sometimes, which would
          // cancel the drop too early. Waiting a few means this really is stuck, not just an
          // unexpected event order.
          setIsPossibleDrag(false);
        }
      }

      const { startX, startY } = dragStartCoordsRef.current;

      const diffX = e.clientX - startX + document.documentElement.scrollLeft;
      const diffY = e.clientY - startY + document.documentElement.scrollTop;

      if (!isDraggingRef.current && Math.abs(diffX) < 5 && Math.abs(diffY) < 5) {
        // Reach minimum drag distance before showing avatar and really dragging.
        return;
      }

      if (!isDraggingRef.current) {
        // Convert from IDs to the real rows, even children
        const draggedRows = [];
        tableTraverser(rows, (rowOrChildRow) => {
          if (dragRowIdsRef.current.includes(rowOrChildRow.id)) {
            draggedRows.push(rowOrChildRow);
          }
        });

        /* istanbul igore else */
        if (draggedRows.length) {
          // Notify of a drag starting and get the details about what this row does.
          const { preview, dropIds } = onDrag(draggedRows);
          setDragPreview(preview);
          setCanDropRowIds(new Set(dropIds));
        }
      }

      // We've reach min drag threshold, so we're really dragging now. This will show the avatar and
      // add onenter listeners to rows.
      setIsDragging(true);

      // clientX is *always* relative to the top, left, so we can't just use logical properties. In
      // RTL mode we want to position relative to the right side explicitly, which means the
      // difference between the right vieport edge (doc width) and clientX.
      /* istanbul ignore next */
      const { left, right } =
        document.dir === 'rtl'
          ? {
              right: `calc(${
                document.documentElement.offsetWidth - startX + getRtlVerticalScrollbarWidth()
              }px - 1.5rem)`,
              left: 'auto',
            }
          : {
              left: `calc(${startX}px - 1.5rem)`,
              right: 'auto',
            };

      if (avatarRef.current) {
        // Update the style directly on the DOM node (not via React) since this is so much faster and
        // we're doing this very frequently.
        Object.assign(avatarRef.current.style, {
          display: '',
          top: `calc(${startY}px - 1.4rem)`, // nudge over a bit, so the cursor is on the tile, not in the very corner.
          left,
          right,
          transform: `translate(${diffX}px, ${diffY}px)`,
        });
      }
    },
    [isDraggingRef, setIsDragging, rows, dragRowIdsRef, onDrag]
  );

  const cancel = useCallback(
    /**
     * Cancels the drag. Tears down the events and snaps back avatar.
     * @param {[event]} e Optional event to stop. Mostly for eating the escape key.
     */
    function cancel(e) {
      if (e) e.stopPropagation();
      snapBackAvatar();
      setIsPossibleDrag(false);
    },
    []
  );

  useEffect(
    /**
     * Once a drag appears to start (user "mousedown"s on a drag handle) this adds the needed event
     * listeners and classes to track the drag. This is the main setup method. We don't technically
     * consider it a real DnD until the mouse has moved a certain threshold though. In that way, we
     * don't set show a drag image (avatar) or update any rows if the user were to just click the
     * drag handle--they need to really drag it a bit.
     *
     * The main dependency of this is `isPossibleDrag`, which is intended to setup the drag events
     * when true, and tear them down when false. The others are just dependencies and not intended
     * to fire this effect per set. In fact, we don't want the other to change while
     * `isPossibleDrag` is true or the drag can be interrupted before it's done. While we can't
     * control what props the caller actually changes, things like `rows` and `onDrop` are unlikely
     * to change during a drag.
     */
    function setupDnd() {
      if (!isPossibleDrag) {
        // Don't connect anything. Everything is torn down in the cleanup from when this this effect
        // was last called.
        cancel();
        return undefined;
      }

      badMoveCountRef.current = 0;

      function handleEscapeKey(e) {
        if (e.key === 'Escape') {
          cancel(e);
        }
      }

      /**
       * Stops an event. This is used to stop click event during drag and drop, otherwise the
       * mouseup can trigger a click on the row and the row click handler will be invoked. For
       * expandable rows, this might expand or collapse the row. We add this to the event capture
       * phase to intercept the click before the row can see it.
       * @param {event} e DOM event.
       */
      function stopEvent(e) {
        e.preventDefault();
        e.stopPropagation();
      }

      document.body.addEventListener('click', stopEvent, true);
      document.body.addEventListener('mouseup', handleDrop);
      document.body.addEventListener('mousemove', handleDragMove);
      document.body.addEventListener('keydown', handleEscapeKey);

      // If the user goes to another window, cancel the dnd.
      window.addEventListener('blur', cancel);

      // Add global drag state class. This is mostly use to ensure the cursor is "grabbing", but can
      // be used to disable non-drag related hover states. We add it here even though the cursor
      // hasn't moved enough to start a real drag so the user can see a drag can be started from the
      // cursor.
      document.body.classList.add(`${iotPrefix}--is-dragging`);

      return function tearDown() {
        // console.debug('Clean up table DnD');
        document.body.removeEventListener('click', stopEvent, true);
        document.body.removeEventListener('mouseup', handleDrop);
        document.body.removeEventListener('mousemove', handleDragMove);
        document.body.removeEventListener('keydown', handleEscapeKey);

        window.removeEventListener('blur', cancel);

        document.body.classList.remove(`${iotPrefix}--is-dragging`);

        setDragRowIds([]);
        activeDropRowIdRef.current = null;
        setCanDropRowIds(new Set());
        setIsDragging(false);
      };
    },
    [isPossibleDrag, handleDragMove, handleDrop, cancel, setIsDragging, setDragRowIds]
  );

  const handleStartPossibleDrag = useCallback(
    /**
     * This is the callback when a user starts a possible drag with a mousedown on a drag handle. At
     * this point we'll set up event listeners to track the mouse movement and decide if it's a real
     * DnD or not. Until it moves past a threshold we don't show a drag image or change the table
     * props yet.
     */
    function handleStartPossibleDrag(e, rowId) {
      dragStartCoordsRef.current = {
        startX: e.clientX,
        startY: e.clientY,
      };

      if (selectedIds.includes(rowId)) {
        // we're in the selected set, so drag all selected rows.
        setDragRowIds(selectedIds);
      } else {
        // just drag this one
        setDragRowIds([rowId]);
      }

      setIsPossibleDrag(true);
    },
    [setDragRowIds, selectedIds]
  );

  /** Ref to the root DOM element of the row overlay. Used to directly update its style. */
  const overlayRef = useRef(null);

  const handleEnterRow = useCallback(
    /**
     *  Callback when the mouse enters a table row. The table needs to add this as an onmouseenter
     *  handler.
     * @param {string} rowId Row mouse is over.
     * @returns
     */
    function handleEnterRow(rowId, rowEl) {
      /* istanbul ignore if */
      if (!isPossibleDrag) {
        // shouldn't happen
        return;
      }

      // The table can scroll in it container. In that case, the row overlay should not span the
      // entire row width, only as wide as the container.
      const scrollContainer = rowEl.closest(`.${prefix}--data-table-content`);
      const contentRect = scrollContainer.getBoundingClientRect();
      const rowRect = rowEl.getBoundingClientRect();
      const style = {
        display: 'block',
        top: `${rowRect.top + document.documentElement.scrollTop}px`,
        left: `${
          contentRect.left + document.documentElement.scrollLeft - getRtlVerticalScrollbarWidth()
        }px`,
        width: `${contentRect.width}px`,
        height: `${rowRect.height}px`,
        zIndex: zIndex + 1000,
      };

      // istanbul ignore else
      if (overlayRef.current) Object.assign(overlayRef.current.style, style);
      rowEl.classList.add(`${iotPrefix}--table__row--dropping`);

      activeDropRowIdRef.current = rowId;
    },
    [isPossibleDrag, zIndex]
  );

  const handleLeaveRow = useCallback(
    /**
     *  Callback when the mouse leaves a table row. The table needs to add this as an onmouseenter
     *  handler.
     * @param {string} rowId A row we are no longer over.
     */
    function handleLeaveRow(rowId, rowEl) {
      /* istanbul ignore else */
      if (activeDropRowIdRef.current === rowId) {
        activeDropRowIdRef.current = null;
        // istanbul ignore else
        if (overlayRef.current) overlayRef.current.style.display = 'none';
        rowEl.classList.remove(`${iotPrefix}--table__row--dropping`);
      }
    },
    []
  );

  // During a drag we show an avatar near the cursor and an overlay over the hovered row, if there
  // is one. These needs to be added to the body element by the caller.
  const dragPreviewAndOverlay = (
    <>
      {isDragging && <TableDropRowOverlay ref={overlayRef} />}
      {/* We can show the preview even if not isDragging during snapback time. */}
      {dragPreview && (
        <TableDragAvatar zIndex={zIndex + 1001} ref={avatarRef}>
          {dragPreview}
        </TableDragAvatar>
      )}
    </>
  );

  return {
    isDragging,
    dragPreview: dragPreviewAndOverlay,
    canDropRowIds,
    dragRowIds,
    handleEnterRow,
    handleLeaveRow,
    handleStartPossibleDrag,
  };
}

export { useTableDnd };
