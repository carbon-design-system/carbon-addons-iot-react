import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { AIListComponent } from '@ai-apps/angular/list';
import { AIListItem } from '@ai-apps/angular/list';

@Component({
  selector: 'ai-list-builder-list',
  template: ` <ai-list #list [items]="items"> </ai-list> `,
})
export class ListBuilderListComponent implements AfterViewInit {
  /**
   * Props for the selected list component
   */
  @Input() listProps: any = {};

  @Input() items: AIListItem[] = [];

  @ViewChild('list') listComponent: AIListComponent;

  ngAfterViewInit() {
    setTimeout(() => {
      Object.assign(this.listComponent, this.listComponent, this.listProps);
    });
  }
}
