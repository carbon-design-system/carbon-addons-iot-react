import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

/**
 * Service for data and config shared between card components
 */
@Injectable()
export class CardService implements OnDestroy {
  /**
   * Overall height of the card
   */
  private height: number = null;

  private expandedSubject = new BehaviorSubject(false);

  private subscriptions = new Subscription();

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

  setExpanded(isExpanded: boolean) {
    this.expandedSubject.next(isExpanded);
  }

  getExpanded() {
    return this.expandedSubject.value;
  }

  onExpand(listener: (isExpanded: boolean) => void) {
    const subscription = this.expandedSubject.subscribe(listener);
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
