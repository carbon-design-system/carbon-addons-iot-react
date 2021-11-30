import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[aiEmptyStateSecondaryAction]',
})
export class EmptyStateSecondaryActionDirective {
  @HostBinding('class') classList = 'iot--empty-state--link';
}
