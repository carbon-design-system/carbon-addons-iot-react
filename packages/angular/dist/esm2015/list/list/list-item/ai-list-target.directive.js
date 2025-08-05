/**
 *
 * @ai-apps/angular v2.155.1 | ai-list-target.directive.js
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


import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
export class AIListTargetDirective {
    constructor() {
        this.targetPosition = 'below';
        this.targetSize = 33;
        this.dropping = new EventEmitter();
        this.dragOver = new EventEmitter();
        this.dragLeave = new EventEmitter();
        this.dragEnter = new EventEmitter();
        this.isActive = false;
    }
    get isNested() {
        return this.targetPosition === 'nested';
    }
    get isAbove() {
        return this.targetPosition === 'above';
    }
    get isBelow() {
        return this.targetPosition === 'below';
    }
    get isNestedOver() {
        return this.targetPosition === 'nested' && this.isActive;
    }
    get isAboveOver() {
        return this.targetPosition === 'above' && this.isActive;
    }
    get isBelowOver() {
        return this.targetPosition === 'below' && this.isActive;
    }
    get height() {
        return `${this.targetSize}%`;
    }
    handleDragEnter(event) {
        this.isActive = true;
        this.dragEnter.emit(event);
    }
    dragover(event) {
        this.dragOver.emit(event);
    }
    handleDrop(event) {
        this.dropping.emit(event);
    }
    handleLeave(event) {
        this.isActive = false;
        this.dragLeave.emit(event);
    }
}
AIListTargetDirective.decorators = [
    { type: Directive, args: [{
                selector: '[aiListTarget]',
            },] }
];
AIListTargetDirective.propDecorators = {
    targetPosition: [{ type: Input }],
    targetSize: [{ type: Input }],
    dropping: [{ type: Output }],
    dragOver: [{ type: Output }],
    dragLeave: [{ type: Output }],
    dragEnter: [{ type: Output }],
    isNested: [{ type: HostBinding, args: ['class.iot--list-item-editable--drop-target-nested',] }],
    isAbove: [{ type: HostBinding, args: ['class.iot--list-item-editable--drop-target-above',] }],
    isBelow: [{ type: HostBinding, args: ['class.iot--list-item-editable--drop-target-below',] }],
    isNestedOver: [{ type: HostBinding, args: ['class.iot--list-item-editable--drop-target-nested__over',] }],
    isAboveOver: [{ type: HostBinding, args: ['class.iot--list-item-editable--drop-target-above__over',] }],
    isBelowOver: [{ type: HostBinding, args: ['class.iot--list-item-editable--drop-target-below__over',] }],
    height: [{ type: HostBinding, args: ['style.height',] }],
    handleDragEnter: [{ type: HostListener, args: ['dragenter', ['$event'],] }],
    dragover: [{ type: HostListener, args: ['dragover', ['$event'],] }],
    handleDrop: [{ type: HostListener, args: ['drop', ['$event'],] }],
    handleLeave: [{ type: HostListener, args: ['dragleave', ['event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWktbGlzdC10YXJnZXQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpc3QvbGlzdC1pdGVtL2FpLWxpc3QtdGFyZ2V0LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFLbEcsTUFBTSxPQUFPLHFCQUFxQjtJQUhsQztRQUlXLG1CQUFjLEdBQWlDLE9BQU8sQ0FBQztRQUV2RCxlQUFVLEdBQUcsRUFBRSxDQUFDO1FBRWYsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFFOUIsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFFOUIsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFFL0IsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFFekMsYUFBUSxHQUFHLEtBQUssQ0FBQztJQW1EbkIsQ0FBQztJQWpEQyxJQUFzRSxRQUFRO1FBQzVFLE9BQU8sSUFBSSxDQUFDLGNBQWMsS0FBSyxRQUFRLENBQUM7SUFDMUMsQ0FBQztJQUVELElBQXFFLE9BQU87UUFDMUUsT0FBTyxJQUFJLENBQUMsY0FBYyxLQUFLLE9BQU8sQ0FBQztJQUN6QyxDQUFDO0lBRUQsSUFBcUUsT0FBTztRQUMxRSxPQUFPLElBQUksQ0FBQyxjQUFjLEtBQUssT0FBTyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxJQUE0RSxZQUFZO1FBQ3RGLE9BQU8sSUFBSSxDQUFDLGNBQWMsS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUMzRCxDQUFDO0lBRUQsSUFBMkUsV0FBVztRQUNwRixPQUFPLElBQUksQ0FBQyxjQUFjLEtBQUssT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDMUQsQ0FBQztJQUVELElBQTJFLFdBQVc7UUFDcEYsT0FBTyxJQUFJLENBQUMsY0FBYyxLQUFLLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQzFELENBQUM7SUFFRCxJQUFpQyxNQUFNO1FBQ3JDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUM7SUFDL0IsQ0FBQztJQUdELGVBQWUsQ0FBQyxLQUFnQjtRQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBR0QsUUFBUSxDQUFDLEtBQWdCO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFHRCxVQUFVLENBQUMsS0FBZ0I7UUFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUdELFdBQVcsQ0FBQyxLQUFnQjtRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDOzs7WUFsRUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0I7YUFDM0I7Ozs2QkFFRSxLQUFLO3lCQUVMLEtBQUs7dUJBRUwsTUFBTTt1QkFFTixNQUFNO3dCQUVOLE1BQU07d0JBRU4sTUFBTTt1QkFJTixXQUFXLFNBQUMsbURBQW1EO3NCQUkvRCxXQUFXLFNBQUMsa0RBQWtEO3NCQUk5RCxXQUFXLFNBQUMsa0RBQWtEOzJCQUk5RCxXQUFXLFNBQUMseURBQXlEOzBCQUlyRSxXQUFXLFNBQUMsd0RBQXdEOzBCQUlwRSxXQUFXLFNBQUMsd0RBQXdEO3FCQUlwRSxXQUFXLFNBQUMsY0FBYzs4QkFJMUIsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzt1QkFNcEMsWUFBWSxTQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQzt5QkFLbkMsWUFBWSxTQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQzswQkFLL0IsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBIb3N0QmluZGluZywgSG9zdExpc3RlbmVyLCBJbnB1dCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thaUxpc3RUYXJnZXRdJyxcbn0pXG5leHBvcnQgY2xhc3MgQUlMaXN0VGFyZ2V0RGlyZWN0aXZlIHtcbiAgQElucHV0KCkgdGFyZ2V0UG9zaXRpb246ICduZXN0ZWQnIHwgJ2Fib3ZlJyB8ICdiZWxvdycgPSAnYmVsb3cnO1xuXG4gIEBJbnB1dCgpIHRhcmdldFNpemUgPSAzMztcblxuICBAT3V0cHV0KCkgZHJvcHBpbmcgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQE91dHB1dCgpIGRyYWdPdmVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBPdXRwdXQoKSBkcmFnTGVhdmUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQE91dHB1dCgpIGRyYWdFbnRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBpc0FjdGl2ZSA9IGZhbHNlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MuaW90LS1saXN0LWl0ZW0tZWRpdGFibGUtLWRyb3AtdGFyZ2V0LW5lc3RlZCcpIGdldCBpc05lc3RlZCgpIHtcbiAgICByZXR1cm4gdGhpcy50YXJnZXRQb3NpdGlvbiA9PT0gJ25lc3RlZCc7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0tbGlzdC1pdGVtLWVkaXRhYmxlLS1kcm9wLXRhcmdldC1hYm92ZScpIGdldCBpc0Fib3ZlKCkge1xuICAgIHJldHVybiB0aGlzLnRhcmdldFBvc2l0aW9uID09PSAnYWJvdmUnO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pb3QtLWxpc3QtaXRlbS1lZGl0YWJsZS0tZHJvcC10YXJnZXQtYmVsb3cnKSBnZXQgaXNCZWxvdygpIHtcbiAgICByZXR1cm4gdGhpcy50YXJnZXRQb3NpdGlvbiA9PT0gJ2JlbG93JztcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MuaW90LS1saXN0LWl0ZW0tZWRpdGFibGUtLWRyb3AtdGFyZ2V0LW5lc3RlZF9fb3ZlcicpIGdldCBpc05lc3RlZE92ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0UG9zaXRpb24gPT09ICduZXN0ZWQnICYmIHRoaXMuaXNBY3RpdmU7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0tbGlzdC1pdGVtLWVkaXRhYmxlLS1kcm9wLXRhcmdldC1hYm92ZV9fb3ZlcicpIGdldCBpc0Fib3ZlT3ZlcigpIHtcbiAgICByZXR1cm4gdGhpcy50YXJnZXRQb3NpdGlvbiA9PT0gJ2Fib3ZlJyAmJiB0aGlzLmlzQWN0aXZlO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pb3QtLWxpc3QtaXRlbS1lZGl0YWJsZS0tZHJvcC10YXJnZXQtYmVsb3dfX292ZXInKSBnZXQgaXNCZWxvd092ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0UG9zaXRpb24gPT09ICdiZWxvdycgJiYgdGhpcy5pc0FjdGl2ZTtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUuaGVpZ2h0JykgZ2V0IGhlaWdodCgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy50YXJnZXRTaXplfSVgO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZHJhZ2VudGVyJywgWyckZXZlbnQnXSlcbiAgaGFuZGxlRHJhZ0VudGVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLmRyYWdFbnRlci5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdvdmVyJywgWyckZXZlbnQnXSlcbiAgZHJhZ292ZXIoZXZlbnQ6IERyYWdFdmVudCkge1xuICAgIHRoaXMuZHJhZ092ZXIuZW1pdChldmVudCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdkcm9wJywgWyckZXZlbnQnXSlcbiAgaGFuZGxlRHJvcChldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgdGhpcy5kcm9wcGluZy5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIFsnZXZlbnQnXSlcbiAgaGFuZGxlTGVhdmUoZXZlbnQ6IERyYWdFdmVudCkge1xuICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLmRyYWdMZWF2ZS5lbWl0KGV2ZW50KTtcbiAgfVxufVxuIl19