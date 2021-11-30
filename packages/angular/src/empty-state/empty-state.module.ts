import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmptyStateComponent } from './empty-state.component';
import { EmptyStateActionDirective } from './empty-state-action.directive';
import { EmptyStateBodyDirective } from './empty-state-body.directive';
import { EmptyStateSecondaryActionDirective } from './empty-state-secondary-action.directive';
import { EmptyStateTitleDirective } from './empty-state-title.directive';
import { AIIconsModule } from '@ai-apps/angular/icons';

@NgModule({
  declarations: [
    EmptyStateComponent,
    EmptyStateActionDirective,
    EmptyStateBodyDirective,
    EmptyStateSecondaryActionDirective,
    EmptyStateTitleDirective,
  ],
  exports: [
    EmptyStateComponent,
    EmptyStateActionDirective,
    EmptyStateBodyDirective,
    EmptyStateSecondaryActionDirective,
    EmptyStateTitleDirective,
  ],
  imports: [CommonModule, AIIconsModule],
})
export class EmptyStateModule {}
