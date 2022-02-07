import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[aiEmptyStateTitle]',
})
export class EmptyStateTitleDirective {
  @HostBinding('class') classList = 'iot--empty-state--title';
}
