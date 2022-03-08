import { Component, ElementRef, Input, TemplateRef } from '@angular/core';
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
          <span *ngIf="!titleTpl">{{ tab.title }}</span>
          <ng-container
            *ngIf="titleTpl"
            [ngTemplateOutlet]="titleTpl"
            [ngTemplateOutletContext]="{ tab: tab }"
          >
          </ng-container>
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
  /**
   * Template to bind to header titles (optional).
   * Tab item is passed in as context.
   *
   * For example:
   *
   * controller = new TabController([
   *  {
   *    title: 'One',
   *    icon: 'edit'
   *  }
   * ]);
   *
   * // Tab items are passed in as context in the form "{tab: tab}" so the let-<your_var_name>="tab" is necessary
   * <ng-template #titleTpl let-tab="tab">
   *  <svg *ngIf="tab.icon" [ibmIcon]="tab.icon" size="16"></svg>
   *  {{ tab.title }}
   * </ng-template>
   *
   * <ai-tabs [controller]="controller" [titleTpl]="titleTpl"></ai-tabs>
   */
  @Input() titleTpl: TemplateRef<any> = null;

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
