import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'ai-empty-state',
  template: `
    <div class="iot--empty-state">
      <div class="iot--empty-state--content">
        <ng-container *ngIf="icon !== 'no-icon'">
          <ng-container *ngIf="isTemplate(icon)" [ngTemplateOutlet]="$any(icon)"></ng-container>
          <ng-container *ngIf="!isTemplate(icon)" [ngSwitch]="icon">
            <empty-state-no-results-icon
              *ngSwitchCase="'no-results'"
              iconClass="iot--empty-state--icon"
            >
            </empty-state-no-results-icon>
            <empty-state-404-icon *ngSwitchCase="'error404'" iconClass="iot--empty-state--icon">
            </empty-state-404-icon>
            <empty-state-not-authorized-icon
              *ngSwitchCase="'not-authorized'"
              iconClass="iot--empty-state--icon"
            >
            </empty-state-not-authorized-icon>
            <empty-state-success-icon *ngSwitchCase="'success'" iconClass="iot--empty-state--icon">
            </empty-state-success-icon>
            <empty-state-error-icon *ngSwitchCase="'error'" iconClass="iot--empty-state--icon">
            </empty-state-error-icon>
            <empty-state-default-icon *ngSwitchDefault iconClass="iot--empty-state--icon">
            </empty-state-default-icon>
          </ng-container>
        </ng-container>
        <ng-content select="[aiEmptyStateTitle]"></ng-content>
        <ng-content select="[aiEmptyStateBody]"></ng-content>
        <ng-content select="[aiEmptyStateAction]"></ng-content>
        <ng-content select="[aiEmptyStateSecondaryAction]"></ng-content>
      </div>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon:
    | 'default'
    | 'error'
    | 'error404'
    | 'not-authorized'
    | 'no-results'
    | 'success'
    | 'no-icon'
    | TemplateRef<any>;

  /**
   * Specifies an empty state action.
   *
   * For example
   *
   * ```typescript
   *  <ai-empty-state
   *     [secondaryAction]="secondaryAction"
   *     [secondaryActionContext]="secondaryActionContext">
   *  </ai-empty-state>
   *
   *  <ng-template #secondaryAction let-data="data">
   *     <button ibmButton (click)="data.action()">Action</button>
   *  </ng-template>
   * ```
   *
   * Where
   *
   * ```typescript
   * secondaryActionContext = {
   *   data: {
   *     action: () => { **Do something** }
   *   }
   * }
   *
   * `secondaryActionContext` is optional.
   * ```
   */
  @Input() secondaryAction: TemplateRef<any>;
  @Input() secondaryActionContext: any;

  public isTemplate(value: any) {
    return value instanceof TemplateRef;
  }
}
