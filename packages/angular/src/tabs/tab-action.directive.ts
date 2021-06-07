import { Component, Directive, ElementRef, OnInit } from '@angular/core';
import { Button } from 'carbon-components-angular';

@Directive({
  selector: '[aiTabAction]',
})
export class TabActionDirective extends Button implements OnInit {
  constructor(protected elementRef: ElementRef) {
    super();
  }

  ngOnInit() {
    this.ibmButton = 'ghost';
    this.size = 'sm';
    this.iconOnly = true;
    const el = this.elementRef.nativeElement as HTMLElement;
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.justifyContent = 'center';
  }
}
