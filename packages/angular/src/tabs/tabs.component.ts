import { Component, ElementRef, Input } from '@angular/core';
import { TabController } from './tab-controller.class';

@Component({
  selector: 'ai-tabs',
  template: `
    <ibm-tab-header-group
      [ngStyle]="{
        'max-width': getMaxWidth()
      }"
    >
      <ai-tab-header
        *ngFor="let tab of controller.getTabs()"
        [active]="(controller.selection | async) === tab.key"
        [tab]="tab"
        [actions]="tab.actions"
        (selected)="onSelected(tab.key)"
      >
        <div class="iot--tab__title-container">
          <span>{{ tab.title }}</span>
        </div>
      </ai-tab-header>
    </ibm-tab-header-group>
    <ng-content select="ai-tab-actions"></ng-content>
  `,
  styles: [
    `
      :host {
        display: flex;
      }
    `,
  ],
})
export class TabsComponent {
  @Input() controller: TabController;

  constructor(protected elementRef: ElementRef) {}

  onSelected(key) {
    this.controller.selectTab(key);
  }

  getMaxWidth() {
    const actions = this.elementRef.nativeElement.querySelector('ai-tab-actions');
    if (!actions) {
      return null;
    }
    return `calc(100% - ${getComputedStyle(actions).width})`;
  }
}
