import { Component, Inject } from '@angular/core';
import { BaseModal, ModalService, TableHeaderItem } from 'carbon-components-angular';
import { AIListItem } from '@ai-apps/angular/list';
import { AIListBuilderItem, AIListBuilderModel } from '@ai-apps/angular/list-builder';
import { AITableModel } from '../table-model.class';

@Component({
  selector: 'ai-column-customization-modal',
  template: `
    <ibm-modal [open]="open" [hasScrollingContent]="false" (overlaySelected)="closeModal()">
      <ibm-modal-header (closeSelect)="closeModal()">
        <h3>Customize columns</h3>
        <p>
          Select the available columns to be displayed on the table. Drag the selected columns to
          reorder them
        </p>
      </ibm-modal-header>
      <section ibmModalContent [hasForm]="true">
        <ai-list-builder
          [model]="listBuilderModel"
          addingMethod="multi-select"
          [listProps]="listProps"
          [addedItemsListProps]="addedItemsListProps"
        >
        </ai-list-builder>
      </section>
      <ibm-modal-footer>
        <button class="bx--btn bx--btn--secondary" (click)="closeModal()">Cancel</button>
        <button class="bx--btn bx--btn--primary" modal-primary-focus (click)="updateColumns()">
          Save
        </button>
      </ibm-modal-footer>
    </ibm-modal>
  `,
})
export class AIColumnCustomizationModal extends BaseModal {
  listBuilderModel = new AIListBuilderModel();

  protected _model: AITableModel;

  constructor(
    @Inject('model') public model = new AITableModel(),
    @Inject('listProps')
    public listProps = {
      title: 'Available columns',
    },
    @Inject('addedItemsListProps')
    public addedItemsListProps = {
      title: 'Selected columns',
    },
    protected modalService: ModalService
  ) {
    super();
    this.listBuilderModel.items = this.headerToListItems(model.header);
  }

  updateColumns() {
    this.moveColumns(this.listBuilderModel.addedItems);
    this.listBuilderModel.items = this.headerToListItems(this.model.header);
    this.closeModal();
  }

  protected headerToListItems(
    header: TableHeaderItem[][],
    headerRow: TableHeaderItem[] = [],
    availableHeaderItems: TableHeaderItem[][] = [],
    rowIndex = 0
  ) {
    if (!headerRow.length && rowIndex === 0) {
      headerRow = header[0];
    }

    if (!availableHeaderItems.length) {
      availableHeaderItems = header.map((headerRow) =>
        headerRow.filter((headerItem) => headerItem !== null)
      );
    }

    return headerRow
      .filter((headerItem) => headerItem !== null)
      .map((headerItem) => {
        const listBuilderItem = new AIListBuilderItem({
          value: headerItem.data,
          isSelectable: true,
          addOnSelect: true,
          addedState: null,
          itemMetaData: {
            headerItem: headerItem,
          },
          addedItemProps: {
            itemMetaData: {
              headerItem: headerItem,
            },
            expanded: false,
            isDraggable: true,
          },
        });

        const colSpan = headerItem?.colSpan || 1;
        const rowSpan = headerItem?.rowSpan || 1;

        if (rowIndex + rowSpan >= this.model.header.length) {
          return listBuilderItem;
        }

        let spaceLeft = colSpan;
        const availableChildren = availableHeaderItems[rowIndex + rowSpan];
        const children = [];

        while (spaceLeft > 0 && availableChildren.length) {
          const nextChild = availableChildren.shift();
          spaceLeft -= nextChild?.colSpan || 1;
          children.push(nextChild);
        }

        listBuilderItem.items = this.headerToListItems(
          header,
          children,
          availableHeaderItems,
          rowIndex + rowSpan
        );

        return listBuilderItem;
      });
  }

  protected listItemsToHeader(
    listItems: AIListItem[],
    header: TableHeaderItem[][] = new Array(this.model.header.length).fill([]),
    rowIndex = 0
  ) {
    listItems.forEach((listItem: any) => {
      const rowSpan = listItem.headerItem?.rowSpan || 1;

      header[rowIndex] = [...header[rowIndex], listItem.itemMetaData.headerItem];

      if (rowIndex + rowSpan >= this.model.header.length) {
        return;
      }

      if (listItem.hasChildren()) {
        this.listItemsToHeader(listItem.items, header, rowIndex + rowSpan);
      }
    });

    return header;
  }

  protected moveColumns(items: AIListItem[]) {
    const header = this.listItemsToHeader(items);
    header.forEach((headerRow, rowIndex) => {
      headerRow.forEach((headerItem, newIndex) => {
        const currentIndex = this.model.header[rowIndex].indexOf(headerItem);
        if (currentIndex !== newIndex) {
          this.model.moveColumn(currentIndex, newIndex, rowIndex);
        }
      });
    });
  }
}
