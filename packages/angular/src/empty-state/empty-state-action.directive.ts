import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[aiEmptyStateAction]',
})
export class EmptyStateActionDirective {
  @HostBinding('class') classList = 'iot--empty-state--action';
}
