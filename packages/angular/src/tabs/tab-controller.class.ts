import { BehaviorSubject, Subscription } from "rxjs";

export class TabController {
  selectionSubject = new BehaviorSubject(null);

  selectTab(key: string) {
    this.selectionSubject.next(key);
  }

  onSelection(handler) {
    return this.selectionSubject.subscribe(handler);
  }
}
