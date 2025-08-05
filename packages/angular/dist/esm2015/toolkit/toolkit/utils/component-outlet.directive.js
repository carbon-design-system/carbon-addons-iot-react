/**
 *
 * @ai-apps/angular v2.155.1 | component-outlet.directive.js
 *
 * Copyright 2014, 2025 IBM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import { ComponentFactoryResolver, Directive, Injector, Input, NgModuleFactory, NgModuleRef, Type, ViewContainerRef, } from '@angular/core';
export class ComponentOutletDirective {
    constructor(_viewContainerRef) {
        this._viewContainerRef = _viewContainerRef;
        this.scComponentOutletInputs = new Map();
        this.scComponentOutletOutputs = new Map();
        this._componentRef = null;
        this._moduleRef = null;
    }
    // end copy
    ngOnChanges(changes) {
        // tslint:disable-next-line
        // copied from https://github.com/angular/angular/blob/263bbd43c1808f1201bc4b50fe76e8fbba672c51/packages/common/src/directives/ng_component_outlet.ts#L10-L116
        this._viewContainerRef.clear();
        this._componentRef = null;
        if (this.scComponentOutlet) {
            const elInjector = this.scComponentOutletInjector || this._viewContainerRef.parentInjector;
            if (changes['scComponentOutletNgModuleFactory']) {
                if (this._moduleRef) {
                    this._moduleRef.destroy();
                }
                if (this.scComponentOutletNgModuleFactory) {
                    const parentModule = elInjector.get(NgModuleRef);
                    this._moduleRef = this.scComponentOutletNgModuleFactory.create(parentModule.injector);
                }
                else {
                    this._moduleRef = null;
                }
            }
            const componentFactoryResolver = this._moduleRef
                ? this._moduleRef.componentFactoryResolver
                : elInjector.get(ComponentFactoryResolver);
            const componentFactory = componentFactoryResolver.resolveComponentFactory(this.scComponentOutlet);
            this._componentRef = this._viewContainerRef.createComponent(componentFactory, this._viewContainerRef.length, elInjector, this.scComponentOutletContent);
        }
        // end copy
        if (changes.scComponentOutletInputs) {
            const inputs = Array.from(changes.scComponentOutletInputs.currentValue);
            for (const [key, value] of inputs) {
                this['_componentRef']['instance'][key] = value;
            }
        }
        if (changes.scComponentOutletOutputs) {
            const outputs = Array.from(changes.scComponentOutletOutputs.currentValue);
            for (const [key, value] of outputs) {
                this['_componentRef']['instance'][key].subscribe((event) => {
                    value(event);
                });
            }
        }
    }
    // tslint:disable-next-line
    // copied from https://github.com/angular/angular/blob/263bbd43c1808f1201bc4b50fe76e8fbba672c51/packages/common/src/directives/ng_component_outlet.ts#L10-L116
    ngOnDestroy() {
        if (this._moduleRef) {
            this._moduleRef.destroy();
        }
    }
}
ComponentOutletDirective.decorators = [
    { type: Directive, args: [{
                selector: '[scComponentOutlet], [aiComponentOutlet]',
            },] }
];
ComponentOutletDirective.ctorParameters = () => [
    { type: ViewContainerRef }
];
ComponentOutletDirective.propDecorators = {
    scComponentOutletInputs: [{ type: Input }],
    scComponentOutletOutputs: [{ type: Input }],
    scComponentOutlet: [{ type: Input }],
    scComponentOutletInjector: [{ type: Input }],
    scComponentOutletContent: [{ type: Input }],
    scComponentOutletNgModuleFactory: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LW91dGxldC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvdG9vbGtpdC91dGlscy9jb21wb25lbnQtb3V0bGV0LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsd0JBQXdCLEVBRXhCLFNBQVMsRUFDVCxRQUFRLEVBQ1IsS0FBSyxFQUNMLGVBQWUsRUFDZixXQUFXLEVBSVgsSUFBSSxFQUNKLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUt2QixNQUFNLE9BQU8sd0JBQXdCO0lBbUJuQyxZQUFvQixpQkFBbUM7UUFBbkMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQWxCOUMsNEJBQXVCLEdBQUcsSUFBSSxHQUFHLEVBQWUsQ0FBQztRQUVqRCw2QkFBd0IsR0FBRyxJQUFJLEdBQUcsRUFBZSxDQUFDO1FBYW5ELGtCQUFhLEdBQTZCLElBQUksQ0FBQztRQUMvQyxlQUFVLEdBQTRCLElBQUksQ0FBQztJQUVPLENBQUM7SUFDM0QsV0FBVztJQUVYLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQywyQkFBMkI7UUFDM0IsOEpBQThKO1FBQzlKLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUUxQixJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMseUJBQXlCLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQztZQUUzRixJQUFJLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxFQUFFO2dCQUMvQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7aUJBQzNCO2dCQUVELElBQUksSUFBSSxDQUFDLGdDQUFnQyxFQUFFO29CQUN6QyxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUN2RjtxQkFBTTtvQkFDTCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztpQkFDeEI7YUFDRjtZQUVELE1BQU0sd0JBQXdCLEdBQUcsSUFBSSxDQUFDLFVBQVU7Z0JBQzlDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHdCQUF3QjtnQkFDMUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUU3QyxNQUFNLGdCQUFnQixHQUFHLHdCQUF3QixDQUFDLHVCQUF1QixDQUN2RSxJQUFJLENBQUMsaUJBQWlCLENBQ3ZCLENBQUM7WUFFRixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQ3pELGdCQUFnQixFQUNoQixJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUM3QixVQUFVLEVBQ1YsSUFBSSxDQUFDLHdCQUF3QixDQUM5QixDQUFDO1NBQ0g7UUFDRCxXQUFXO1FBRVgsSUFBSSxPQUFPLENBQUMsdUJBQXVCLEVBQUU7WUFDbkMsTUFBTSxNQUFNLEdBQXlCLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzlGLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7YUFDaEQ7U0FDRjtRQUVELElBQUksT0FBTyxDQUFDLHdCQUF3QixFQUFFO1lBQ3BDLE1BQU0sT0FBTyxHQUF5QixLQUFLLENBQUMsSUFBSSxDQUM5QyxPQUFPLENBQUMsd0JBQXdCLENBQUMsWUFBWSxDQUM5QyxDQUFDO1lBQ0YsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE9BQU8sRUFBRTtnQkFDbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO29CQUN6RCxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDLENBQUM7YUFDSjtTQUNGO0lBQ0gsQ0FBQztJQUVELDJCQUEyQjtJQUMzQiw4SkFBOEo7SUFDOUosV0FBVztRQUNULElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQzs7O1lBekZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsMENBQTBDO2FBQ3JEOzs7WUFMQyxnQkFBZ0I7OztzQ0FPZixLQUFLO3VDQUVMLEtBQUs7Z0NBS0wsS0FBSzt3Q0FFTCxLQUFLO3VDQUVMLEtBQUs7K0NBRUwsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgQ29tcG9uZW50UmVmLFxuICBEaXJlY3RpdmUsXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgTmdNb2R1bGVGYWN0b3J5LFxuICBOZ01vZHVsZVJlZixcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFR5cGUsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbc2NDb21wb25lbnRPdXRsZXRdLCBbYWlDb21wb25lbnRPdXRsZXRdJyxcbn0pXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50T3V0bGV0RGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBzY0NvbXBvbmVudE91dGxldElucHV0cyA9IG5ldyBNYXA8c3RyaW5nLCBhbnk+KCk7XG5cbiAgQElucHV0KCkgc2NDb21wb25lbnRPdXRsZXRPdXRwdXRzID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgLy8gY29waWVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9ibG9iLzI2M2JiZDQzYzE4MDhmMTIwMWJjNGI1MGZlNzZlOGZiYmE2NzJjNTEvcGFja2FnZXMvY29tbW9uL3NyYy9kaXJlY3RpdmVzL25nX2NvbXBvbmVudF9vdXRsZXQudHMjTDEwLUwxMTZcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgpIHNjQ29tcG9uZW50T3V0bGV0ITogVHlwZTxhbnk+O1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCkgc2NDb21wb25lbnRPdXRsZXRJbmplY3RvciE6IEluamVjdG9yO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCkgc2NDb21wb25lbnRPdXRsZXRDb250ZW50ITogYW55W11bXTtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgpIHNjQ29tcG9uZW50T3V0bGV0TmdNb2R1bGVGYWN0b3J5ITogTmdNb2R1bGVGYWN0b3J5PGFueT47XG5cbiAgcHJpdmF0ZSBfY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8YW55PiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9tb2R1bGVSZWY6IE5nTW9kdWxlUmVmPGFueT4gfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmKSB7fVxuICAvLyBlbmQgY29weVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAvLyBjb3BpZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvMjYzYmJkNDNjMTgwOGYxMjAxYmM0YjUwZmU3NmU4ZmJiYTY3MmM1MS9wYWNrYWdlcy9jb21tb24vc3JjL2RpcmVjdGl2ZXMvbmdfY29tcG9uZW50X291dGxldC50cyNMMTAtTDExNlxuICAgIHRoaXMuX3ZpZXdDb250YWluZXJSZWYuY2xlYXIoKTtcbiAgICB0aGlzLl9jb21wb25lbnRSZWYgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMuc2NDb21wb25lbnRPdXRsZXQpIHtcbiAgICAgIGNvbnN0IGVsSW5qZWN0b3IgPSB0aGlzLnNjQ29tcG9uZW50T3V0bGV0SW5qZWN0b3IgfHwgdGhpcy5fdmlld0NvbnRhaW5lclJlZi5wYXJlbnRJbmplY3RvcjtcblxuICAgICAgaWYgKGNoYW5nZXNbJ3NjQ29tcG9uZW50T3V0bGV0TmdNb2R1bGVGYWN0b3J5J10pIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZHVsZVJlZikge1xuICAgICAgICAgIHRoaXMuX21vZHVsZVJlZi5kZXN0cm95KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zY0NvbXBvbmVudE91dGxldE5nTW9kdWxlRmFjdG9yeSkge1xuICAgICAgICAgIGNvbnN0IHBhcmVudE1vZHVsZSA9IGVsSW5qZWN0b3IuZ2V0KE5nTW9kdWxlUmVmKTtcbiAgICAgICAgICB0aGlzLl9tb2R1bGVSZWYgPSB0aGlzLnNjQ29tcG9uZW50T3V0bGV0TmdNb2R1bGVGYWN0b3J5LmNyZWF0ZShwYXJlbnRNb2R1bGUuaW5qZWN0b3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX21vZHVsZVJlZiA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyID0gdGhpcy5fbW9kdWxlUmVmXG4gICAgICAgID8gdGhpcy5fbW9kdWxlUmVmLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlclxuICAgICAgICA6IGVsSW5qZWN0b3IuZ2V0KENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcik7XG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoXG4gICAgICAgIHRoaXMuc2NDb21wb25lbnRPdXRsZXRcbiAgICAgICk7XG5cbiAgICAgIHRoaXMuX2NvbXBvbmVudFJlZiA9IHRoaXMuX3ZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KFxuICAgICAgICBjb21wb25lbnRGYWN0b3J5LFxuICAgICAgICB0aGlzLl92aWV3Q29udGFpbmVyUmVmLmxlbmd0aCxcbiAgICAgICAgZWxJbmplY3RvcixcbiAgICAgICAgdGhpcy5zY0NvbXBvbmVudE91dGxldENvbnRlbnRcbiAgICAgICk7XG4gICAgfVxuICAgIC8vIGVuZCBjb3B5XG5cbiAgICBpZiAoY2hhbmdlcy5zY0NvbXBvbmVudE91dGxldElucHV0cykge1xuICAgICAgY29uc3QgaW5wdXRzOiBBcnJheTxbc3RyaW5nLCBhbnldPiA9IEFycmF5LmZyb20oY2hhbmdlcy5zY0NvbXBvbmVudE91dGxldElucHV0cy5jdXJyZW50VmFsdWUpO1xuICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgaW5wdXRzKSB7XG4gICAgICAgIHRoaXNbJ19jb21wb25lbnRSZWYnXVsnaW5zdGFuY2UnXVtrZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMuc2NDb21wb25lbnRPdXRsZXRPdXRwdXRzKSB7XG4gICAgICBjb25zdCBvdXRwdXRzOiBBcnJheTxbc3RyaW5nLCBhbnldPiA9IEFycmF5LmZyb20oXG4gICAgICAgIGNoYW5nZXMuc2NDb21wb25lbnRPdXRsZXRPdXRwdXRzLmN1cnJlbnRWYWx1ZVxuICAgICAgKTtcbiAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIG91dHB1dHMpIHtcbiAgICAgICAgdGhpc1snX2NvbXBvbmVudFJlZiddWydpbnN0YW5jZSddW2tleV0uc3Vic2NyaWJlKChldmVudCkgPT4ge1xuICAgICAgICAgIHZhbHVlKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gIC8vIGNvcGllZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvYmxvYi8yNjNiYmQ0M2MxODA4ZjEyMDFiYzRiNTBmZTc2ZThmYmJhNjcyYzUxL3BhY2thZ2VzL2NvbW1vbi9zcmMvZGlyZWN0aXZlcy9uZ19jb21wb25lbnRfb3V0bGV0LnRzI0wxMC1MMTE2XG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9tb2R1bGVSZWYpIHtcbiAgICAgIHRoaXMuX21vZHVsZVJlZi5kZXN0cm95KCk7XG4gICAgfVxuICB9XG4gIC8vIGVuZCBjb3B5XG59XG4iXX0=