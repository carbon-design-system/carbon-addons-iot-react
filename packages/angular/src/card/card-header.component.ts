import { Component, HostBinding } from "@angular/core";

@Component({
  selector: "ai-card-header",
  template: `
    <ng-content></ng-content>
  `
})
export class CardHeaderComponent {
  @HostBinding("class.iot--card--header") hostClass="true";
}
