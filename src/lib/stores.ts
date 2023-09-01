import type { EmployeeStockPurchase, RestrictedStockUnits } from './model';
import { writable, type Writable } from 'svelte/store';

const createBrowserStore = <T>(name: string, initialValue: T) => {
	const store = writable<T>(JSON.parse(localStorage.getItem(name) ?? 'null')) ?? initialValue;

	// Store the token in LocalStorage whenever it´s updated
	store.subscribe((val) => {
		if (!localStorage) return;
		if (!val) return localStorage.removeItem(name);
		localStorage.setItem(name, JSON.stringify(val));
	});

	return store;
};

// just enough to not crash in Node
const createNodeStore = <T>(initialValue: T) => writable<T>(initialValue);

export const stocksStore: Writable<StocksStore> =
	typeof localStorage === 'undefined'
		? createNodeStore({ espp: { stocks: [] }, rsu: { stocks: [] } })
		: createBrowserStore('stocks', { espp: { stocks: [] }, rsu: { stocks: [] } });

interface StocksStore {
	espp: { stocks: EmployeeStockPurchase[] };
	rsu: { stocks: RestrictedStockUnits[] };
}

export const insertOrUpdate = <T>(current: T[], entity: T, id: number | null = null) => {
	const newState = [...current];

	if (id === null) {
		newState.push(entity);
	} else {
		newState[id] = entity;
	}

	return newState;
};
