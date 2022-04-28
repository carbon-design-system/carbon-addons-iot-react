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
    this.listBuilderModel.items = this.model.tabularToNodeList(this.headerItemToNode);
  }

  updateColumns() {
    // const { header } = this.model.nodeListToTabular(this.listBuilderModel.addedItems);
    this.reorderColumnsTo(header);
    // this.listBuilderModel.items = this.headerToListItems(this.model.header);
    this.closeModal();
  }

  protected headerItemToNode(headerItem: TableHeaderItem) {
    return new AIListBuilderItem({
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
    })
  }

  protected reorderColumnsTo(header: TableHeaderItem[][]) {
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
