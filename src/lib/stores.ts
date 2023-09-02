import type { EmployeeStockPurchase, RestrictedStockUnits } from './model';
import { derived, readable, writable, type Writable } from 'svelte/store';
import { fetchForNow } from './yfinance-api';

const createBrowserStore = <T>(name: string, initialValue: T) => {
	const store = writable<T>(JSON.parse(localStorage.getItem(name) ?? 'null') ?? initialValue);

	// Store the token in LocalStorage whenever it´s updated
	store.subscribe((val) => {
		localStorage?.setItem(name, JSON.stringify(val));
	});

	return store;
};

// just enough to not crash in Node
const createNodeStore = <T>(initialValue: T) => writable<T>(initialValue);

const createPersistentStore = <T>(name: string, initialValue: T) =>
	typeof localStorage === 'undefined' ? createNodeStore(initialValue) : createBrowserStore(name, initialValue);

interface StocksStore {
	espp: { stocks: EmployeeStockPurchase[] };
	rsu: { stocks: RestrictedStockUnits[] };
}

export const stocksStore: Writable<StocksStore> = createPersistentStore('stocks', {
	espp: { stocks: [] },
	rsu: { stocks: [] },
});
export const esppStore = derived(stocksStore, ($stocksStore) => $stocksStore.espp.stocks);
export const rsuStore = derived(stocksStore, ($stocksStore) => $stocksStore.rsu.stocks);

export const insertOrUpdate = <T>(current: T[], entity: T, id: number | null = null) => {
	const newState = [...current];

	if (id === null) {
		newState.push(entity);
	} else {
		newState[id] = entity;
	}

	return newState;
};

export const exchangeRateStore = readable<number | null>(null, function start(set) {
	fetchForNow('EUR=X').then(set);
});

export const stockPriceStore = readable(-1, function start(set) {
	fetchForNow('DT').then(set);
});

export const taxStore = createPersistentStore('tax', 0.48);
