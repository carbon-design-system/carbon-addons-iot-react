import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TabController } from './tab-controller.class';
import { TabService } from './tab.service';

@Component({
  selector: 'ai-tabs',
  template: `
    <ibm-tab-header-group [ngStyle]="{
      'max-width': getMaxWidth()
    }">
      <ibm-tab-header
        *ngFor="let tab of controller.getTabs()"
        [active]="(controller.selection | async) === tab.key"
        (selected)="onSelected(tab.key)">
        {{tab.title}}
      </ibm-tab-header>
    </ibm-tab-header-group>
    <ng-content select="ai-tab-actions"></ng-content>
  `,
  providers: [TabService],
  styles: [`
    :host {
      display: flex;
    }
  `]
})
export class TabsComponent implements OnInit, OnDestroy {
  @Input() controller: TabController;

  constructor(protected elementRef: ElementRef) { }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  onSelected(key) {
    this.controller.selectPane(key);
  }

  getMaxWidth() {
    const actions = this.elementRef.nativeElement.querySelector('ai-tab-actions');
    return `calc(100% - ${getComputedStyle(actions).width})`;
  }
}
