import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ButtonModule,
  DropdownModule,
  IconModule,
  IconService,
  InputModule,
  UtilsModule,
} from 'carbon-components-angular';
import { RuleBuilderComponent } from './rule-builder.component';
import { ContextMenuModule } from 'carbon-components-angular/context-menu';

import Subtract32 from '@carbon/icons/es/subtract/32';
import Add32 from '@carbon/icons/es/add/32';
import TextNewLine32 from '@carbon/icons/es/text--new-line/32';

import { RuleComponent } from './rule.component';
import { FormsModule } from '@angular/forms';
import { RuleBuilderHeaderComponent } from './rule-builder-header.component';
import { RuleBuilderGroupLogicComponent } from './rule-builder-group-logic.component';

@NgModule({
  declarations: [
    RuleComponent,
    RuleBuilderComponent,
    RuleBuilderGroupLogicComponent,
    RuleBuilderHeaderComponent,
  ],
  exports: [
    RuleComponent,
    RuleBuilderComponent,
    RuleBuilderGroupLogicComponent,
    RuleBuilderHeaderComponent,
  ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    IconModule,
    InputModule,
    ContextMenuModule,
    UtilsModule,
  ],
})
export class RuleBuilderModule {
  constructor(private iconService: IconService) {
    this.iconService.register(Subtract32);
    this.iconService.register(Add32);
    this.iconService.register(TextNewLine32);
  }
}
