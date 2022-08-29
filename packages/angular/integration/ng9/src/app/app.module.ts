import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ContextMenuModule, DialogModule, IconModule } from 'carbon-components-angular';
import { ButtonMenuModule, ListModule } from '@ai-apps/angular';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		ButtonMenuModule,
		ListModule,
		ContextMenuModule,
		DialogModule,
		IconModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
