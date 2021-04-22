import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Query, SimpleChanges, ViewChild } from '@angular/core';
import { DocumentService, DropdownList, DropdownService } from 'carbon-components-angular';
import { TabController } from './tab-controller.class';

@Component({
  selector: 'ai-tab-dropdown',
  template: `
    <button aiTabAction #dropdownButton (click)="toggleMenu()">
      <svg class="bx--btn__icon" ibmIcon="chevron--down" size="16"></svg>
    </button>
    <div style="display: none;" class="dropdown-menu" #dropdownMenu>
      <ibm-dropdown-list [items]="displayItems" (select)="onSelect($event)"></ibm-dropdown-list>
    </div>
  `,
  styles: [`
    .dropdown-menu {
      left: -105px;
      position: relative;
    }
  `]
})
export class TabDropdownComponent implements OnChanges, OnInit, OnDestroy {
  @Input() controller: TabController;
  @ViewChild('dropdownMenu', { static: true }) dropdownMenu: ElementRef;
  @ViewChild('dropdownButton', { static: true }) dropdownButton: ElementRef;
  @ViewChild(DropdownList) dropdownList: DropdownList;
  isOpen = false;
  displayItems = [];

  constructor(protected dropdownService: DropdownService, protected elementRef: ElementRef, protected documentService: DocumentService) { }

  ngOnInit() {
    this.documentService.handleClick(event => {
      const hostElement = this.elementRef.nativeElement as HTMLElement;
      const menuElement = this.dropdownMenu.nativeElement as HTMLElement;
      const target = event.target as Node;
      if (this.isOpen && !hostElement.contains(target) && !menuElement.contains(target)) {
        this.close();
      }
    });
    this.updateItems();

    this.controller.handlePaneSelection(key => {
      this.updateItems(key);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {

    }
  }

  updateItems(selectedKey = null) {
    this.displayItems = this.controller.getTabs().map(item => {
      return {
        content: item.title,
        key: item.key,
        selected: selectedKey === item.key
      };
    });
  }

  onSelect(event) {
    console.log(event);
    if (!event.isUpdate) {
      this.controller.selectPane(event.item.key);
    }
  }

  toggleMenu() {
    if (!this.isOpen) {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    this.isOpen = true;
    const wrapper: HTMLElement = this.dropdownService.appendToBody(
      this.dropdownButton.nativeElement,
      this.dropdownMenu.nativeElement,
      '');
    wrapper.style.width = '250px';
    this.dropdownList.initFocus();
  }

  close() {
    this.isOpen = false;
    this.dropdownService.appendToDropdown(this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    this.close();
  }
}
