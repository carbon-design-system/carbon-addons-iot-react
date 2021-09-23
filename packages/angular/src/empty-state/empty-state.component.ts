import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'ai-empty-state',
  template: `
    <div class="iot--empty-state">
      <div class="iot--empty-state--content">
        <ng-container *ngIf="icon !== 'no-icon'">
          <ng-container *ngIf="isTemplate(icon)" [ngTemplateOutlet]="icon"></ng-container>
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
        <h3 class="iot--empty-state--title">
          {{ title }}
        </h3>
        <p class="iot--empty-state--text">
          {{ body }}
        </p>
        <div *ngIf="action" class="iot--empty-state--action">
          <ng-container [ngTemplateOutlet]="action" [ngTemplateOutletContext]="actionContext">
          </ng-container>
        </div>
        <div *ngIf="secondaryAction" class="iot--empty-state--link">
          <ng-container
            [ngTemplateOutlet]="secondaryAction"
            [ngTemplateOutletContext]="secondaryActionContext"
          >
          </ng-container>
        </div>
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
   * Specify an optional className to be applied to the container
   */
  @Input() containerClass: string;

  /**
   * Title of empty state
   */
  @Input() title: string;
  /**
   * Description of empty state
   */
  @Input() body: string;

  /**
   * Specifies an empty state action.
   *
   * For example
   *
   * ```typescript
   *  <ai-empty-state
   *     [action]="action"
   *     [actionContext]="actionContext">
   *  </ai-empty-state>
   *
   *  <ng-template #action let-data="data">
   *     <button ibmButton (click)="data.action()">Action</button>
   *  </ng-template>
   * ```
   *
   * Where
   *
   * ```typescript
   * actionContext = {
   *   data: {
   *     action: () => { **Do something** }
   *   }
   * }
   *
   * `actionContext` is optional.
   * ```
   */
  @Input() action: TemplateRef<any>;
  @Input() actionContext: any;

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
