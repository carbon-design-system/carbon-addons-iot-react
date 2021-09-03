import { Component, Input } from '@angular/core';
import { BaseModal, TableHeaderItem } from 'carbon-components-angular';
import { AIListItem } from 'src/list';
import { AIListBuilderItem, AIListBuilderModel } from 'src/list-builder';
import { AITableModel } from '../table-model.class';

@Component({
  selector: 'ai-column-customization-modal',
  template: `
    <ibm-modal open="true" [hasScrollingContent]="false" (overlaySelected)="closeModal()">
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
          [listProps]="{
            title: 'Available columns'
          }"
          [addedItemsListProps]="{
            title: 'Selected columns'
          }"
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
  @Input() set model(tableModel: AITableModel) {
    this._model = tableModel;
    this.listBuilderModel.items = this.headerToListItems(this.model.header);
  }

  get model() {
    return this._model;
  }

  listBuilderModel = new AIListBuilderModel();

  protected _model: AITableModel;

  updateColumns() {
    this.moveColumns(this.listBuilderModel.addedItems);
    this.listBuilderModel.items = this.headerToListItems(this.model.header);
  }

  protected headerToListItems(header: TableHeaderItem[][]) {
    const availableHeaderItems = header.map((headerRow) =>
      headerRow.map((headerItem) => headerItem)
    );

    return this.createListItems(header[0], availableHeaderItems);
  }

  protected createListItems(
    headerRow: TableHeaderItem[],
    availableHeaderItems: TableHeaderItem[][],
    rowIndex = 0
  ) {
    return headerRow.map((headerItem) => {
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

      listBuilderItem.items = this.createListItems(
        children,
        availableHeaderItems,
        rowIndex + rowSpan
      );

      return listBuilderItem;
    });
  }

  protected createHeader(listItems: AIListItem[], headers: any[][], rowIndex = 0) {
    listItems.forEach((listItem) => {
      headers[rowIndex].push(listItem.itemMetaData.headerItem);

      if (listItem.hasChildren()) {
        this.createHeader(
          listItem.items,
          headers,
          rowIndex + (listItem.itemMetaData.headerItem?.rowSpan || 1)
        );
      }
    });
  }

  protected listItemsToHeader(listItems: AIListItem[]) {
    // fill([]) gives each row the same array reference.
    const header = new Array(this.model.header.length).fill(0).map(() => []);
    this.createHeader(listItems, header);
    return header;
  }

  protected moveColumns(items: AIListItem[]) {
    const newHeader = this.listItemsToHeader(items);

    // Move items to their new positions
    newHeader.forEach((newHeaderRow, rowIndex) => {
      const headerRow = this.model.header[rowIndex];

      newHeaderRow.forEach((newHeaderItem, colIndex) => {
        const prevItem = colIndex > 0 ? newHeaderRow[colIndex - 1] : newHeaderRow[colIndex];

        const indexFrom = headerRow.findIndex((headerItem) => headerItem === newHeaderItem);
        const indexTo =
          headerRow.findIndex((headerItem) => headerItem === prevItem) + (colIndex > 0 ? 1 : 0);

        this.model.moveColumn(indexFrom, indexTo, rowIndex);
      });
    });
  }
}
