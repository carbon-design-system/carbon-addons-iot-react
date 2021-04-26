import { combineLatest } from 'rxjs';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tab } from './tab.interface';

export class TabController {
  public selection = new Subject<any>();
  public tabListWithSelection: Observable<Tab[]>;
  public tabList: Observable<Tab[]>;
  private tabSource = new BehaviorSubject<Tab[]>([]);
  constructor(tabList = []) {
    this.tabListWithSelection = combineLatest([this.selection, this.tabSource]).pipe(map(([selection, tabs]) => {
      return tabs.map(tab => {
        return {
          ...tab,
          selected: selection === tab.key,
        };
      });
    }));
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

  removeTab(tabToRemove: Tab) {
    const filteredTabs = this.tabSource.getValue().filter(tab => tab !== tabToRemove);
    this.setTabs(filteredTabs);
  }

  removeTabAt(indexToRemove: number) {
    const filteredTabs = this.tabSource.getValue().filter((_, index) => index !== indexToRemove);
    this.setTabs(filteredTabs);
  }
}
