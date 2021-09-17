import { combineLatest } from 'rxjs';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tab } from './tab.interface';

export class TabController {
  public selection = new BehaviorSubject<any>(null);
  public tabListWithSelection: Observable<Tab[]>;
  public tabList: Observable<Tab[]>;
  private tabSource = new BehaviorSubject<Tab[]>([]);
  constructor(tabList = []) {
    this.tabListWithSelection = combineLatest([this.selection, this.tabSource]).pipe(
      map(([selection, tabs]) => {
        return tabs.map((tab) => {
          return {
            ...tab,
            selected: selection === tab.key,
          };
        });
      })
    );
    this.tabSource.next(tabList);
    this.tabList = this.tabSource.asObservable();
  }

  setTabs(tabList: Tab[]) {
    this.tabSource.next(tabList);
  }

  getTabs() {
    return this.tabSource.getValue();
  }

  addTab(tab: Tab) {
    this.setTabs([...this.tabSource.getValue(), tab]);
  }

  selectTab(key: any) {
    this.selection.next(key);
  }

  updateTab(updatedTab: Tab) {
    const updatedTabs = this.tabSource.getValue().map((tab) => {
      if (tab.key === updatedTab.key) {
        return updatedTab;
      }
      return tab;
    });
    this.setTabs(updatedTabs);
  }

  removeTab(key: any): any {
    const tabs = this.tabSource.getValue();
    const index = tabs.findIndex((tab) => tab.key === key);
    const filteredTabs = tabs.filter((tab) => tab.key !== key);
    this.setTabs(filteredTabs);
    return index > 0 ? filteredTabs[index - 1].key : filteredTabs[0]?.key;
  }
}
