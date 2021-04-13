import { Directive, HostBinding, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { TabController } from "./tab-controller.class";

@Directive({
  selector: '[aiTabContent]'
})
export class TabContentDirective {
  @HostBinding('class.iot--tab__content--selected') selected = false;
  @Input() aiTabContent: TabController;
  @Input() key: string;

  protected selectionSubscription: Subscription;

  ngOnInit() {
    this.selectionSubscription = this.aiTabContent.onSelection(key => {
      if (key === this.key) {
        this.selected = true;
      } else {
        this.selected = false;
      }
    });
  }

  ngOnDestroy() {
    this.selectionSubscription.unsubscribe();
  }
}
