import { Component, Input, OnInit } from '@angular/core';
import { Tab } from 'carbon-components-angular';
import { TabController } from './tab-controller.class';

@Component({
  selector: 'ai-tab',
  template: `
    <div
			[attr.tabindex]="tabIndex"
			role="tabpanel"
			*ngIf="shouldRender()"
			class="bx--tab-content"
			[ngStyle]="{'display': active ? null : 'none'}"
			[attr.aria-labelledby]="id + '-header'"
			aria-live="polite">
			<ng-content></ng-content>
		</div>
  `
})
export class TabComponent extends Tab implements OnInit {
  @Input() key: string;
  @Input() controller: TabController;

  ngOnInit() {
    this.controller.handlePaneSelection(key => {
      this.active = key === this.key;
      console.log('select');
    });
  }
}
