import { Subject } from 'rxjs';

export class TabController {
  public selection = new Subject();
  constructor(private tabList = []) {
  }

  setTabs(tabList) {
    this.tabList = tabList;
  }

  addTab(tab) {
    this.tabList.push(tab);
  }

  getTabs() {
    return this.tabList;
  }

  selectPane(key) {
    this.selection.next(key);
  }

  handlePaneSelection(listener) {
    return this.selection.subscribe(listener);
  }
}
