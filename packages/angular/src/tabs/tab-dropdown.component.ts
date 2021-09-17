import { Component, ElementRef, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {
  DocumentService,
  DropdownList,
  DropdownService,
  ListItem,
} from 'carbon-components-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TabController } from './tab-controller.class';

@Component({
  selector: 'ai-tab-dropdown',
  template: `
    <button aiTabAction #dropdownButton (click)="toggleMenu()">
      <svg class="bx--btn__icon" ibmIcon="chevron--down" size="16"></svg>
    </button>
    <div style="display: none;" class="dropdown-menu bx--list-box--expanded" #dropdownMenu>
      <ibm-dropdown-list [items]="displayItems" (select)="onSelect($event)"></ibm-dropdown-list>
    </div>
  `,
  providers: [DropdownService],
})
export class TabDropdownComponent implements OnInit, OnDestroy {
  @Input() controller: TabController;
  @ViewChild('dropdownMenu', { static: true }) dropdownMenu: ElementRef;
  @ViewChild('dropdownButton', { static: true }) dropdownButton: ElementRef;
  @ViewChild(DropdownList) dropdownList: DropdownList;
  isOpen = false;
  displayItems: any;

  constructor(
    protected dropdownService: DropdownService,
    protected elementRef: ElementRef,
    protected documentService: DocumentService
  ) {}

  ngOnInit() {
    // TODO: update dropdown service to handle menus fixed to the right side of the trigger
    this.dropdownService.offset = {
      /**
       * 105 = 210 / 2 the dropdown service will center the menu and
       * then align it to the left edge of the trigger element
       */
      left: 105,
    };

    this.documentService.handleClick((event) => {
      const hostElement = this.elementRef.nativeElement as HTMLElement;
      const menuElement = this.dropdownMenu.nativeElement as HTMLElement;
      const target = event.target as Node;
      if (this.isOpen && !hostElement.contains(target) && !menuElement.contains(target)) {
        this.closeMenu();
      }
    });

    this.displayItems = this.controller.tabListWithSelection.pipe(
      map((list) => {
        return list.map((item) => ({
          content: item.title,
          key: item.key,
          selected: item.selected,
        }));
      })
    );
  }

  onSelect(event) {
    if (!event.isUpdate) {
      this.controller.selectTab(event.item.key);
      this.closeMenu();
    }
  }

  toggleMenu() {
    if (!this.isOpen) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  openMenu() {
    this.isOpen = true;
    const wrapper: HTMLElement = this.dropdownService.appendToBody(
      this.dropdownButton.nativeElement,
      this.dropdownMenu.nativeElement,
      ''
    );
    wrapper.style.width = '250px';
    this.dropdownList.initFocus();
  }

  closeMenu() {
    this.isOpen = false;
    this.dropdownService.appendToDropdown(this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    this.closeMenu();
  }
}
