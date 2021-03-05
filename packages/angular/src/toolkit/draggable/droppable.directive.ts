import {
	Directive,
	EventEmitter,
	HostListener,
	Output
} from "@angular/core";

@Directive({
	selector: "[scDropzone], [aiDropzone]"
})
export class DroppableDirective {
	@Output() active = new EventEmitter<boolean>();

	@Output() leave = new EventEmitter();

	@Output() dropping = new EventEmitter();

	@HostListener("dragover", ["$event"])
	@HostListener("dragenter", ["$event"])
	handleDrag(event: DragEvent) {
		event.preventDefault();
		this.active.emit(true);
	}

	@HostListener("drop")
	handleDrop() {
		this.active.emit(false);
		this.dropping.emit();
	}

	@HostListener("dragleave")
	handleLeave() {
		this.leave.emit();
	}
}
