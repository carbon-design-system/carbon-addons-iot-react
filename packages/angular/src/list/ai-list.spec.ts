import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AIListComponent, ListModule } from './index';
import { AIListItem } from './list-item/ai-list-item.class';

const allSelected = (items: AIListItem[]) =>
  items.every((item) => {
    if (item.hasChildren()) {
      allSelected(item.items);
    }

    return item.selected;
  });

describe('List', () => {
  let fixture, element, wrapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListModule, CommonModule],
    });
  });

  it('should initialize an `AIListComponent`', () => {
    fixture = TestBed.createComponent(AIListComponent);
    expect(fixture.componentInstance instanceof AIListComponent).toBe(true);
  });

  it('should select/deselect all list item children in multi-select list', () => {
    const item = new AIListItem({
      id: 'test',
      isSelectable: true,
      items: [
        new AIListItem({ isSelectable: true }),
        new AIListItem({ isSelectable: true }),
        new AIListItem({ isSelectable: true }),
        new AIListItem({ isSelectable: true }),
      ],
    });

    fixture = TestBed.createComponent(AIListComponent);
    wrapper = fixture.componentInstance;
    wrapper.items = [item];
    wrapper.selectionType = 'multi';

    fixture.detectChanges();

    element = fixture.debugElement.query(By.css('#test_checkbox_input'));
    element.nativeElement.click();
    element.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(allSelected(wrapper.items)).toBe(true);

    element = fixture.debugElement.query(By.css('#test_checkbox_input'));
    element.nativeElement.click();
    element.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(allSelected(wrapper.items)).toBe(false);
  });

  it('should select/deselect all list item parents in multi-select list', () => {
    const item = new AIListItem({
      id: 'test',
      isSelectable: true,
      expanded: true,
      items: [
        new AIListItem({ isSelectable: true }),
        new AIListItem({ isSelectable: true }),
        new AIListItem({ isSelectable: true }),
        new AIListItem({ isSelectable: true }),
      ],
    });

    fixture = TestBed.createComponent(AIListComponent);
    wrapper = fixture.componentInstance;
    wrapper.items = [
      new AIListItem({
        expanded: true,
        isSelectable: true,
        items: [
          new AIListItem({
            expanded: true,
            isSelectable: true,
            items: [
              new AIListItem({
                expanded: true,
                isSelectable: true,
                items: [item],
              }),
            ],
          }),
        ],
      }),
    ];

    wrapper.selectionType = 'multi';

    fixture.detectChanges();

    element = fixture.debugElement.query(By.css('#test_checkbox_input'));
    element.nativeElement.click();
    element.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(allSelected(wrapper.items)).toBe(true);

    element = fixture.debugElement.query(By.css('#test_checkbox_input'));
    element.nativeElement.click();
    element.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(allSelected(wrapper.items)).toBe(false);
  });

  it('should set the correct indeterminate state of parents in multi-select list', () => {
    const item = new AIListItem({
      isSelectable: true,
      expanded: true,
      items: [
        new AIListItem({ isSelectable: true, id: 'item_1', expanded: true }),
        new AIListItem({ isSelectable: true, id: 'item_2', expanded: true }),
        new AIListItem({ isSelectable: true, id: 'item_3', expanded: true }),
        new AIListItem({ isSelectable: true, id: 'item_4', expanded: true }),
      ],
    });

    fixture = TestBed.createComponent(AIListComponent);
    wrapper = fixture.componentInstance;
    wrapper.items = [item];

    wrapper.selectionType = 'multi';

    fixture.detectChanges();

    element = fixture.debugElement.query(By.css('#item_1_checkbox_input'));
    element.nativeElement.click();
    element.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(item.indeterminate).toBe(true);

    element = fixture.debugElement.query(By.css('#item_1_checkbox_input'));
    element.nativeElement.click();
    element.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(item.indeterminate).toBe(false);

    element = fixture.debugElement.query(By.css('#item_1_checkbox_input'));
    element.nativeElement.click();
    element.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(item.indeterminate).toBe(true);

    element = fixture.debugElement.query(By.css('#item_2_checkbox_input'));
    element.nativeElement.click();
    element.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(item.indeterminate).toBe(true);

    element = fixture.debugElement.query(By.css('#item_3_checkbox_input'));
    element.nativeElement.click();
    element.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(item.indeterminate).toBe(true);

    element = fixture.debugElement.query(By.css('#item_4_checkbox_input'));
    element.nativeElement.click();
    element.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(item.indeterminate).toBe(false); // Should be selected at this point.
    expect(allSelected(wrapper.items)).toBe(true);
  });
});
