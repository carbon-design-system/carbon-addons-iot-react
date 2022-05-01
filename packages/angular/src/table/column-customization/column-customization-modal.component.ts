import { AfterViewInit, Component, Inject, TemplateRef } from '@angular/core';
import { BaseModal, ModalService } from 'carbon-components-angular';
import { AIListItem } from '@ai-apps/angular/list';
import { ListBuilderItem } from '@ai-apps/angular/list-builder';
import { AITableHeaderItem, AITableModel } from '../table-model.class';
import { SelectionType } from '@ai-apps/angular/list';

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
          [items]="listBuilderItems"
          (selectedListItemsChange)="setSelectedListItems($event)"
          (unselectedListItemsChange)="setUnselectedListItems($event)"
          [unselectedListTitle]="unselectedListTitle"
          [unselectedListItemsDraggable]="unselectedListItemsDraggable"
          [unselectedListSelectionType]="unselectedListSelectionType"
          [unselectedListHeaderButtons]="unselectedListHeaderButtons"
          [unselectedListHeaderButtonsContext]="unselectedListHeaderButtonsContext"
          [unselectedListAllowDropOutsideParents]="unselectedListAllowDropOutsideParents"
          [selectedListTitle]="selectedListTitle"
          [selectedListItemsDraggable]="selectedListItemsDraggable"
          [selectedListSelectionType]="selectedListSelectionType"
          [selectedListSelectionType]="selectedListSelectionType"
          [selectedListHeaderButtons]="selectedListHeaderButtons"
          [selectedListHeaderButtonsContext]="selectedListHeaderButtonsContext"
          [selectedListAllowDropOutsideParents]="selectedListAllowDropOutsideParents"
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

    <ng-template #buttons>
      <button
        class="iot--list-builder__reset-button iot--btn bx--btn bx--btn--sm bx--btn--ghost"
        (click)="onReset()"
      >
        Reset
        <svg ibmIcon="reset" size="16"></svg>
      </button>
    </ng-template>
  `,
})
export class ColumnCustomizationModal extends BaseModal implements AfterViewInit {
  public listBuilderItems: ListBuilderItem[];
  protected unselectedListItems: AIListItem[];
  protected selectedListItems: AIListItem[];

  constructor(
    @Inject('model') public model = new AITableModel(),
    @Inject('usedModel') public usedModel = new AITableModel(),
    // List builder props
    @Inject('addingMethod') public addingMethod = 'multi-select',
    // Unselected list props
    @Inject('unselectedListTitle') public unselectedListTitle = 'Available items',
    @Inject('unselectedListItemsDraggable') public unselectedListItemsDraggable = false,
    @Inject('unselectedListSelectionType') public unselectedListSelectionType = SelectionType.MULTI,
    @Inject('unselectedListHeaderButtons') public unselectedListHeaderButtons: TemplateRef<any>,
    @Inject('unselectedListHeaderButtonsContext') public unselectedListHeaderButtonsContext: any,
    @Inject('unselectedListAllowDropOutsideParents')
    public unselectedListAllowDropOutsideParents = false,
    // Selected list props
    @Inject('selectedListTitle') public selectedListTitle = 'Selected items',
    @Inject('selectedListItemsDraggable') public selectedListItemsDraggable = true,
    @Inject('selectedListSelectionType') public selectedListSelectionType: SelectionType,
    @Inject('selectedListHeaderButtons') public selectedListHeaderButtons: TemplateRef<any>,
    @Inject('selectedListHeaderButtonsContext') public selectedListHeaderButtonsContext: any,
    @Inject('selectedListAllowDropOutsideParents')
    public selectedListAllowDropOutsideParents = false,
    protected modalService: ModalService
  ) {
    super();
    this.listBuilderItems = this.model.tabularToNodeList(this.headerItemToNode);
  }

  setUnselectedListItems(unselectedListItems: AIListItem[]) {
    this.unselectedListItems = unselectedListItems;
  }

  setSelectedListItems(selectedListItems: AIListItem[]) {
    this.selectedListItems = selectedListItems;
  }

  ngAfterViewInit() {
    // Need the event to propagate after list items have rendered in the DOM.
    setTimeout(() => {
      this.syncListBuilderItemsToUsedModelState();
    });
  }

  updateColumns() {
    // If any columns are deleted and added back, it would be difficult to try and merge the
    // headers and their associated datapoint columns back together. So instead, just reinitialize
    // the usedModel with the original model so it has all the original columns, delete newly
    // deselected columns, and then reorder.
    this.usedModel.initFrom(this.model);
    this.deleteUnselectedColumns();
    const { header } = this.usedModel.nodeListToTabular(this.selectedListItems);
    this.reorderColumnsTo(header);
    this.closeModal();
  }

  onReset() {
    this.usedModel.initFrom(this.model);
    this.listBuilderItems = this.usedModel.tabularToNodeList(this.headerItemToNode);
  }

  protected headerItemToNode(headerItem: AITableHeaderItem) {
    return new ListBuilderItem({
      addingMethod: 'select',
      hideUnselectedItemOnSelect: false,
      headerItem,
      added: true,
      items: [],
      unselectedItemState: {
        value: headerItem.data,
        isSelectable: true,
        expanded: false,
        selected: true,
        headerItem,
      },
      selectedItemState: {
        value: headerItem.data,
        isDraggable: true,
        expanded: false,
        headerItem,
      },
    });
  }

  protected reorderColumnsTo(header: AITableHeaderItem[][]) {
    header.forEach((headerRow, rowIndex) => {
      headerRow.forEach((headerItem, newIndex) => {
        const currentIndex = this.usedModel.headerColumnIndexOf(headerItem);
        if (currentIndex !== newIndex) {
          this.usedModel.moveColumn(currentIndex, newIndex, rowIndex);
        }
      });
    });
  }

  protected deleteUnselectedColumns() {
    const headerItemsToRemove = this.listBuilderItems
      .filter((item: ListBuilderItem) => !item.added)
      .map((item: ListBuilderItem) => item.headerItem);

    headerItemsToRemove.forEach((headerItem: AITableHeaderItem) => {
      const columnIndex = this.usedModel.headerColumnIndexOf(headerItem);
      if (columnIndex >= 0) {
        this.usedModel.deleteColumn(columnIndex);
      }
    });
  }

  protected syncListBuilderItemsToUsedModelState() {
    const usedListBuilderItems = this.usedModel.tabularToNodeList(this.headerItemToNode);
    this.syncListItemSelectedStates(this.unselectedListItems, usedListBuilderItems);
    this.syncListItemOrder(this.selectedListItems, usedListBuilderItems);
  }

  /**
   * Syncs the `selected` states of the given `listNode`s to the `usedListBuilderNode`s.
   * @param listItem
   * @param usedListBuilderNodeList
   */
  protected syncListItemSelectedStates(
    listItemNodeList: AIListItem[],
    usedListBuilderNodeList: ListBuilderItem[]
  ) {
    listItemNodeList.forEach((listItemNode) => {
      const listBuilderNode = usedListBuilderNodeList.find(
        (listItem) => listItem.headerItem === listItemNode.headerItem
      );
      if (!listBuilderNode) {
        listItemNode.select(false, true);
        // Select will propagate to children and parents of the node so we can stop recursion.
        return;
      }
      if (listItemNode.hasChildren()) {
        this.syncListItemSelectedStates(listItemNode.items, listBuilderNode.items);
      }
    });
  }

  /**
   * Syncs the order of the given `listItemNodeList` to the `usedListBuilderNodeList`.
   * @param listItemNodeList
   * @param usedListBuilderNodeList
   */
  protected syncListItemOrder(
    listItemNodeList: AIListItem[],
    usedListBuilderNodeList: ListBuilderItem[]
  ) {
    usedListBuilderNodeList.forEach((listBuilderNode: ListBuilderItem, newIndex: number) => {
      const oldIndex = listItemNodeList.findIndex(
        (selectedItemsNode: AIListItem) =>
          selectedItemsNode.headerItem === listBuilderNode.headerItem
      );

      const nodeToMove = listItemNodeList[oldIndex];
      listItemNodeList.splice(oldIndex, 1);
      listItemNodeList.splice(newIndex, 0, nodeToMove);

      if (nodeToMove.hasChildren()) {
        this.syncListItemOrder(nodeToMove.items, listBuilderNode.items);
      }
    });
  }
}
