import { Directive, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[aiTabContent]'
})
export class TabContentDirective implements OnInit, OnDestroy {
  @HostBinding('class.iot--tab__content--selected') selected = false;
  @Input() key: string;

  ngOnInit() {

  }

  ngOnDestroy() {

  }
}
