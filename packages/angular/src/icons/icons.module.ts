import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EmptyStateDefaultIcon } from './empty-state-default-icon.component';
import { EmptyStateNoResultsIcon } from './empty-state-no-results-icon.component';
import { EmptyState404Icon } from './empty-state-404-icon.component';
import { EmptyStateErrorIcon } from './empty-state-error-icon.component';
import { EmptyStateSuccessIcon } from './empty-state-success-icon.component';
import { EmptyStateNotAuthorizedIcon } from './empty-state-not-authorized-icon.component';


@NgModule({
  declarations: [
    EmptyStateDefaultIcon,
    EmptyStateNoResultsIcon,
    EmptyState404Icon,
    EmptyStateErrorIcon,
    EmptyStateSuccessIcon,
    EmptyStateNotAuthorizedIcon
  ],
  imports: [CommonModule],
  exports: [
    EmptyStateDefaultIcon,
    EmptyStateNoResultsIcon,
    EmptyState404Icon,
    EmptyStateErrorIcon,
    EmptyStateSuccessIcon,
    EmptyStateNotAuthorizedIcon
  ],
})
export class AIIconsModule {}
