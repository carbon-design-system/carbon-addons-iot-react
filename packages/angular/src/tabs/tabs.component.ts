import { Component, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { TabController } from "./tab-controller.class";

@Component({
  selector: 'ai-tabs',
  template: `

  `
})
export class TabsComponent {
  @Input() tabController: TabController;

  selected = null;

  protected selectionSubscription: Subscription;

  ngOnInit() {
    this.selectionSubscription = this.tabController.onSelection(key => {
      this.selected = key;
    });
  }

  ngOnDestroy() {
    this.selectionSubscription.unsubscribe();
  }
}
