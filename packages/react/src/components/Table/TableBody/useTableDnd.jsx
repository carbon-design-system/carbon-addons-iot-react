import React, { useEffect, useState, useRef, useCallback } from 'react';

import { settings } from '../../../constants/Settings';

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
    setValue(newValue);
    ref.current = newValue;
  }, []);

  return [ref, value, setter];
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
 * @property {string[]} canDropRowIds The row IDs that can be dropped on. These were given by the
 * caller from the `onDrag` callback.
 * @property {string} dragRowId The row that's being dragger.
 *
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
 * @param {(string, object) -> [ReactNode, string[]])} onDrag Callback fires when a drag actually
 * start. This passes the caller the ID of the row being dragged and the values for that row. It
 * must return a tuple of a ReactNode to show as the drag image and a list of row IDs that can
 * accept a drop from the given dragged row ID.
 * @param {(string, string) => void} onDrop Callback when a drop succeeds. Passes the ID of the row
 * being dragged and the ID of the row being dropped on.
 * @returns {UseTableDndResult} Values to mix into the table.
 */
function useTableDnd(rows, selectedIds, onDrag, onDrop) {
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
  const [activeDropRowIdRef, activeDropRowId, setActiveDropRowId] = useRefAndState(null);

  // Used to set the abs position of the drop overlay.
  const [activeDropRowOverlayStyle, setActiveDropRowOverlayStyle] = useState(null);

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
      avatarRef.current.style.transform = 'translate(0, 0)';
    }
  }

  const handleDrop = useCallback(
    /**
     * Called when a drop occurs. Ends the drag operations and fires the `onDrop` callback if over a
     * row that can be dropped on.
     */
    function handleDrop(e) {
      // stop so row click handler will not be invoked
      e.stopPropagation();

      if (activeDropRowIdRef.current == null) {
        snapBackAvatar();
      } else {
        setDragPreview(null);
        // Notify of success. Protect from caller errors.
        onDrop(dragRowIds, activeDropRowIdRef.current);
      }
      setIsPossibleDrag(false);
    },
    [activeDropRowIdRef, onDrop, dragRowIds]
  );

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
        // Must have had mouseup outside the window.
        setIsPossibleDrag(false);
        return;
      }

      const { startX, startY } = dragStartCoordsRef.current;

      const diffX = e.clientX - startX + document.documentElement.scrollLeft;
      const diffY = e.clientY - startY + document.documentElement.scrollTop;

      if (!isDraggingRef.current && Math.abs(diffX) < 5 && Math.abs(diffY) < 5) {
        // Reach minimum drag distance before showing avatar and really dragging.
        return;
      }

      if (!isDraggingRef.current) {
        const draggedRows = rows.filter((row) => dragRowIdsRef.current.includes(row.id));

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

      if (avatarRef.current) {
        // Update the style directly on the DOM node (not via React) since this is so much faster and
        // we're doing this very frequently.
        Object.assign(avatarRef.current.style, {
          display: '',
          top: `calc(${startY}px - 1.4rem)`, // nudge over a bit, so the cursor is on the tile, not in the very corner.
          left: `calc(${startX}px - 1.5rem)`,
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

      function handleEscapeKey(e) {
        if (e.key === 'Escape') {
          cancel(e);
        }
      }

      document.body.addEventListener('mousemove', handleDragMove);
      document.body.addEventListener('mouseup', handleDrop);
      document.body.addEventListener('keydown', handleEscapeKey);

      // Normally a mouseup ends this, but of the cursor goes outside the window then the mouseup
      // may never fire. In that case, click can be used to end the drag.
      document.body.addEventListener('click', cancel);

      // If the user goes to another window, cancel the dnd.
      window.addEventListener('blur', cancel);

      // Add global drag state class. This is mostly use to ensure the cursor is "grabbing", but can
      // be used to disable non-drag related hover states. We add it here even though the cursor
      // hasn't moved enough to start a real drag so the user can see a drag can be started from the
      // cursor.
      document.body.classList.add(`${iotPrefix}--is-dragging`);

      return function tearDown() {
        // console.debug('Clean up table DnD');
        document.body.removeEventListener('mousemove', handleDragMove);
        document.body.removeEventListener('mouseup', handleDrop);
        document.body.removeEventListener('keydown', handleEscapeKey);

        document.body.removeEventListener('click', cancel);

        window.removeEventListener('blur', cancel);

        document.body.classList.remove(`${iotPrefix}--is-dragging`);

        setDragRowIds([]);
        setActiveDropRowId(null);
        setActiveDropRowOverlayStyle(null);
        setCanDropRowIds(new Set());
        setIsDragging(false);
      };
    },
    [
      isPossibleDrag,
      handleDragMove,
      handleDrop,
      cancel,
      setActiveDropRowId,
      setIsDragging,
      setDragRowIds,
    ]
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
        top: `${rowRect.top + document.documentElement.scrollTop}px`,
        left: `${contentRect.left + document.documentElement.scrollLeft}px`,
        width: `${contentRect.width}px`,
        height: `${rowRect.height}px`,
      };

      setActiveDropRowOverlayStyle(style);
      setActiveDropRowId(rowId);
    },
    [isPossibleDrag, setActiveDropRowId]
  );

  const handleLeaveRow = useCallback(
    /**
     *  Callback when the mouse leaves a table row. The table needs to add this as an onmouseenter
     *  handler.
     * @param {string} rowId A row we are no longer over.
     */
    function handleLeaveRow(rowId) {
      if (activeDropRowId === rowId) {
        setActiveDropRowOverlayStyle(null);
        setActiveDropRowId(null);
      }
    },
    [activeDropRowId, setActiveDropRowId]
  );

  // During a drag we show an avatar near the cursor and an overlay over the hovered row, if there
  // is one. These needs to be added to the body element by the caller.
  const dragPreviewAndOverlay = (
    <>
      {isDragging && activeDropRowOverlayStyle && (
        <TableDropRowOverlay style={activeDropRowOverlayStyle} />
      )}
      {/* We can show the preview even if not isDragging during snapback time. */}
      {dragPreview && <TableDragAvatar ref={avatarRef}>{dragPreview}</TableDragAvatar>}
    </>
  );

  return {
    isDragging,
    dragPreview: dragPreviewAndOverlay,
    activeDropRowId,
    canDropRowIds,
    dragRowIds,
    handleEnterRow,
    handleLeaveRow,
    handleStartPossibleDrag,
  };
}

export { useTableDnd };
