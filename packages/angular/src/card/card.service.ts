import { Injectable } from '@angular/core';

/**
 * Service for data and config shared between card components
 */
@Injectable()
export class CardService {
  /**
   * Overall height of the card
   */
  private height: number = null;

  /**
   * Set the overall height of the card in pixels
   *
   * @param height height specified in pixels
   */
  setCardHeight(height: number) {
    this.height = height;
  }

  /**
   * Get the overall height of the card as a formatted string
   *
   * @returns the height as a string ex. `'200px'`
   */
  getCardHeight() {
    if (!this.height) {
      return '';
    }
    return `${this.height}px`;
  }

  /**
   * Get the height of just the content area as a formatted string
   *
   * @returns the height as a string ex. `'200px'`
   */
  getContentHeight() {
    if (!this.height) {
      return '';
    }
    return `${this.height - 48}px`;
  }
}
