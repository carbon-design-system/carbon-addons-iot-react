import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Tab } from 'carbon-components-angular';
import { Subscription } from 'rxjs';
import { TabController } from './tab-controller.class';

@Component({
  selector: 'ai-tab',
  template: `
    <div
      [attr.tabindex]="tabIndex"
      role="tabpanel"
      *ngIf="shouldRender()"
      class="bx--tab-content"
      [ngStyle]="{
        display: active ? null : 'none'
      }"
      [attr.aria-labelledby]="id + '-header'"
      aria-live="polite"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class TabComponent extends Tab implements OnInit, OnDestroy {
  @Input() key: string;
  @Input() controller: TabController;

  protected selectionSubscription: Subscription;

  ngOnInit() {
    // use a subscription to set this.active since that affects a number of other
    // tab internals
    this.selectionSubscription = this.controller.selection.subscribe((key) => {
      this.active = key === this.key;
    });
  }

  ngOnDestroy() {
    this.selectionSubscription.unsubscribe();
  }
}
