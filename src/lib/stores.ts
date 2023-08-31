import type { EmployeeStockPurchase, RestrictedStockUnits } from './model';
import { writable, type Writable } from 'svelte/store';

const createBrowserStore = <T>(name: string) => {
	const store = writable<T[]>(JSON.parse(localStorage.getItem(name) ?? '[]'));

	// Store the token in LocalStorage whenever it´s updated
	store.subscribe((val) => {
		if (!localStorage) return;
		if (!val) return localStorage.removeItem(name);
		localStorage.setItem(name, JSON.stringify(val));
	});

	return store;
};

// just enough to not crash in Node
const createNodeStore = <T>() => writable<T[]>([]);

export const esppStore: Writable<EmployeeStockPurchase[]> =
	typeof localStorage === 'undefined' ? createNodeStore() : createBrowserStore('espp');
export const rsuStore: Writable<RestrictedStockUnits[]> =
	typeof localStorage === 'undefined' ? createNodeStore() : createBrowserStore('rsu');
