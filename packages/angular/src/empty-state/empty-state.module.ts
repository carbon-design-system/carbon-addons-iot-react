import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmptyStateComponent } from './empty-state.component';
import {
  EmptyStateDefaultIcon,
  EmptyStateNoResultsIcon,
  EmptyState404Icon,
  EmptyStateErrorIcon,
  EmptyStateNotAuthorizedIcon,
  EmptyStateSuccessIcon,
} from '@ai-apps/angular/icons';

@NgModule({
  declarations: [
    EmptyStateComponent,
    EmptyStateDefaultIcon,
    EmptyStateNoResultsIcon,
    EmptyState404Icon,
    EmptyStateErrorIcon,
    EmptyStateNotAuthorizedIcon,
    EmptyStateSuccessIcon,
  ],
  exports: [EmptyStateComponent],
  imports: [CommonModule],
})
export class EmptyStateModule {}
