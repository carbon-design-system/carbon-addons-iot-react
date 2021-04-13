import { NgModule } from "@angular/core";
import { IconModule, TabsModule as CTabsModule } from "carbon-components-angular";
import { TabsComponent } from "./tabs.component";

@NgModule({
  declarations: [
    TabsComponent
  ],
  imports: [
    CTabsModule,
    IconModule
  ],
  exports: [
    TabsComponent
  ]
})
export class TabsModule {}
