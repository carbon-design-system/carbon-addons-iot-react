import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule, IconModule, IconService, UtilsModule } from 'carbon-components-angular';
import { ButtonMenuComponent } from './button-menu.component';
import { ContextMenuModule } from 'carbon-components-angular/context-menu';

import ChevronUp16 from '@carbon/icons/es/chevron--up/16';

@NgModule({
  declarations: [ButtonMenuComponent],
  exports: [ButtonMenuComponent],
  imports: [CommonModule, ButtonModule, IconModule, ContextMenuModule, UtilsModule],
})
export class ButtonMenuModule {
  constructor(private iconService: IconService) {
    this.iconService.register(ChevronUp16);
  }
}
