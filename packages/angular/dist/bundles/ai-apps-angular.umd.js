/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular.umd.js
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


(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@ai-apps/angular/card'), require('@ai-apps/angular/button-menu'), require('@ai-apps/angular/empty-state'), require('@ai-apps/angular/icons'), require('@ai-apps/angular/toolkit'), require('@ai-apps/angular/flyout-menu'), require('@ai-apps/angular/date-time-picker'), require('@ai-apps/angular/list'), require('@ai-apps/angular/table'), require('@ai-apps/angular/rule-builder')) :
	typeof define === 'function' && define.amd ? define('@ai-apps/angular', ['exports', '@ai-apps/angular/card', '@ai-apps/angular/button-menu', '@ai-apps/angular/empty-state', '@ai-apps/angular/icons', '@ai-apps/angular/toolkit', '@ai-apps/angular/flyout-menu', '@ai-apps/angular/date-time-picker', '@ai-apps/angular/list', '@ai-apps/angular/table', '@ai-apps/angular/rule-builder'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["ai-apps"] = global["ai-apps"] || {}, global["ai-apps"].angular = {}), global["ai-apps"].angular.card, global["ai-apps"].angular["button-menu"], global["ai-apps"].angular["empty-state"], global["ai-apps"].angular.icons, global["ai-apps"].angular.toolkit, global["ai-apps"].angular["flyout-menu"], global["ai-apps"].angular["date-time-picker"], global["ai-apps"].angular.list, global["ai-apps"].angular.table, global["ai-apps"].angular["rule-builder"]));
})(this, (function (exports, card, buttonMenu, emptyState, icons, toolkit, flyoutMenu, dateTimePicker, list, table, ruleBuilder) { 'use strict';

	/**
	 * Generated bundle index. Do not edit.
	 */

	Object.keys(card).forEach(function (k) {
		if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function () { return card[k]; }
		});
	});
	Object.keys(buttonMenu).forEach(function (k) {
		if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function () { return buttonMenu[k]; }
		});
	});
	Object.keys(emptyState).forEach(function (k) {
		if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function () { return emptyState[k]; }
		});
	});
	Object.keys(icons).forEach(function (k) {
		if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function () { return icons[k]; }
		});
	});
	Object.keys(toolkit).forEach(function (k) {
		if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function () { return toolkit[k]; }
		});
	});
	Object.keys(flyoutMenu).forEach(function (k) {
		if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function () { return flyoutMenu[k]; }
		});
	});
	Object.keys(dateTimePicker).forEach(function (k) {
		if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function () { return dateTimePicker[k]; }
		});
	});
	Object.keys(list).forEach(function (k) {
		if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function () { return list[k]; }
		});
	});
	Object.keys(table).forEach(function (k) {
		if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function () { return table[k]; }
		});
	});
	Object.keys(ruleBuilder).forEach(function (k) {
		if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function () { return ruleBuilder[k]; }
		});
	});

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ai-apps-angular.umd.js.map
