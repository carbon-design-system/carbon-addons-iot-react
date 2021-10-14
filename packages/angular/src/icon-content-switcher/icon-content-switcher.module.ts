// modules
import { NgModule } from '@angular/core';

// imports
import { IconContentSwitcherOption } from '.';
import { IconContentSwitcher } from '.';

@NgModule({
  declarations: [IconContentSwitcher, IconContentSwitcherOption],
  exports: [IconContentSwitcher, IconContentSwitcherOption],
})
export class IconContentSwitcherModule {}
