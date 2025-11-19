/**
 * Copyright IBM Corp. 2016, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const keys = {
  Escape: 'Escape',
  Enter: 'Enter',
  Space: ' ',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Tab: 'Tab',
};

/**
 * Check if the given event matches the provided key or keys
 * @param {KeyboardEvent} event - The keyboard event to check
 * @param {string|string[]} keyOrKeys - A key or array of keys to match against
 * @returns {boolean} - True if the event key matches
 */
export function match(event, keyOrKeys) {
  if (Array.isArray(keyOrKeys)) {
    return keyOrKeys.some((key) => event.key === key);
  }
  return event.key === keyOrKeys;
}

/**
 * Get the character from a keyboard event
 * @param {KeyboardEvent} event - The keyboard event
 * @returns {string} - The character from the event
 */
export function getCharacterFor(event) {
  return event.key;
}

// Made with Bob
