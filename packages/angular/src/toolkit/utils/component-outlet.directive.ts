import {
	ComponentFactoryResolver,
	ComponentRef,
	Directive,
	Injector,
	Input,
	NgModuleFactory,
	NgModuleRef,
	OnChanges,
	OnDestroy,
	SimpleChanges,
	Type,
	ViewContainerRef
} from "@angular/core";

@Directive({
	selector: "[scComponentOutlet], [aiComponentOutlet]"
})
export class ComponentOutletDirective implements OnChanges, OnDestroy {
	@Input() scComponentOutletInputs = new Map<string, any>();

	@Input() scComponentOutletOutputs = new Map<string, any>();

	// tslint:disable-next-line
	// copied from https://github.com/angular/angular/blob/263bbd43c1808f1201bc4b50fe76e8fbba672c51/packages/common/src/directives/ng_component_outlet.ts#L10-L116
	// TODO(issue/24571): remove '!'.
	@Input() scComponentOutlet!: Type<any>;
	// TODO(issue/24571): remove '!'.
	@Input() scComponentOutletInjector!: Injector;
	// TODO(issue/24571): remove '!'.
	@Input() scComponentOutletContent!: any[][];
	// TODO(issue/24571): remove '!'.
	@Input() scComponentOutletNgModuleFactory!: NgModuleFactory<any>;

	private _componentRef: ComponentRef<any> | null = null;
	private _moduleRef: NgModuleRef<any> | null = null;

	constructor(private _viewContainerRef: ViewContainerRef) { }
	// end copy

	ngOnChanges(changes: SimpleChanges) {
		// tslint:disable-next-line
		// copied from https://github.com/angular/angular/blob/263bbd43c1808f1201bc4b50fe76e8fbba672c51/packages/common/src/directives/ng_component_outlet.ts#L10-L116
		this._viewContainerRef.clear();
		this._componentRef = null;

		if (this.scComponentOutlet) {
			const elInjector = this.scComponentOutletInjector || this._viewContainerRef.parentInjector;

			if (changes["scComponentOutletNgModuleFactory"]) {
				if (this._moduleRef) { this._moduleRef.destroy(); }

				if (this.scComponentOutletNgModuleFactory) {
					const parentModule = elInjector.get(NgModuleRef);
					this._moduleRef = this.scComponentOutletNgModuleFactory.create(parentModule.injector);
				} else {
					this._moduleRef = null;
				}
			}

			const componentFactoryResolver = this._moduleRef ? this._moduleRef.componentFactoryResolver :
				elInjector.get(ComponentFactoryResolver);

			const componentFactory =
				componentFactoryResolver.resolveComponentFactory(this.scComponentOutlet);

			this._componentRef = this._viewContainerRef.createComponent(
				componentFactory, this._viewContainerRef.length, elInjector,
				this.scComponentOutletContent);
		}
		// end copy

		if (changes.scComponentOutletInputs) {
			const inputs: Array<[string, any]> = Array.from(changes.scComponentOutletInputs.currentValue);
			for (const [key, value] of inputs) {
				this["_componentRef"]["instance"][key] = value;
			}
		}

		if (changes.scComponentOutletOutputs) {
			const outputs: Array<[string, any]> = Array.from(changes.scComponentOutletOutputs.currentValue);
			for (const [key, value] of outputs) {
				this["_componentRef"]["instance"][key].subscribe((event) => {
					value(event);
				});
			}
		}
	}

	// tslint:disable-next-line
	// copied from https://github.com/angular/angular/blob/263bbd43c1808f1201bc4b50fe76e8fbba672c51/packages/common/src/directives/ng_component_outlet.ts#L10-L116
	ngOnDestroy() {
		if (this._moduleRef) { this._moduleRef.destroy(); }
	}
	// end copy
}
