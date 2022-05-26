import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[aiEmptyStateBody]',
})
export class EmptyStateBodyDirective {
  @HostBinding('class') classList = 'iot--empty-state--text';
}
