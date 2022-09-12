import { AIListItem } from '@ai-apps/angular';
import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	items = [
		new AIListItem({ value: 'Canada', isSelectable: true }),
		new AIListItem({ value: 'Brazil', isSelectable: true }),
		new AIListItem({ value: 'Columbia', isSelectable: true }),
		new AIListItem({ value: 'United States of America', isSelectable: true }),
		new AIListItem({ value: 'Uruguay', isSelectable: true }),
		new AIListItem({ value: 'Spain', isSelectable: true }),
	];
}
