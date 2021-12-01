import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmptyStateComponent } from './empty-state.component';
import { EmptyStateActionComponent } from './empty-state-action-wrapper.component';
import { EmptyStateBodyDirective } from './empty-state-body.directive';
import { EmptyStateSecondaryActionComponent } from './empty-state-secondary-action-wrapper.component';
import { EmptyStateTitleDirective } from './empty-state-title.directive';
import { AIIconsModule } from '@ai-apps/angular/icons';

@NgModule({
  declarations: [
    EmptyStateComponent,
    EmptyStateActionComponent,
    EmptyStateBodyDirective,
    EmptyStateSecondaryActionComponent,
    EmptyStateTitleDirective,
  ],
  exports: [
    EmptyStateComponent,
    EmptyStateActionComponent,
    EmptyStateBodyDirective,
    EmptyStateSecondaryActionComponent,
    EmptyStateTitleDirective,
  ],
  imports: [CommonModule, AIIconsModule],
})
export class EmptyStateModule {}
