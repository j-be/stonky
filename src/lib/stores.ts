import type { EmployeeStockPurchase, RestrictedStockUnits } from './model';
import { derived, readable, writable, type Writable } from 'svelte/store';
import { fetchForNow } from './yfinance-api';
import { storageReadWrite } from './persistence/storage';
import { getDurationInMonths } from './utils';

/*
 * Types
 */
interface StocksStore {
	espp: { stocks: EmployeeStockPurchase[] };
	rsu: { stocks: RestrictedStockUnits[] };
}

interface Settings {
	incomeTax: number;
	hideDisclaimer: boolean;
}

/*
 * Helpers
 */
const createPersistentStore = <T>(name: string, initialValue: T) => {
	const [read, write] = storageReadWrite<T>(name);
	const store = writable<T>({
		...initialValue,
		...read(),
	});
	store.subscribe((val) => write(val));
	return store;
};

export const insertOrUpdate = <T>(current: T[], entity: T, id: number | null = null) => {
	const newState = [...current];

	if (id === null) {
		newState.push(entity);
	} else {
		newState[id] = entity;
	}

	return newState;
};

/*
 * Stores
 */
export const stocksStore: Writable<StocksStore> = createPersistentStore('stocks', {
	espp: { stocks: [] },
	rsu: { stocks: [], sellings: [] },
});
export const esppStore = derived(stocksStore, ($stocksStore) => $stocksStore.espp.stocks);
export const rsuStore = derived(stocksStore, ($stocksStore) => $stocksStore.rsu.stocks);

export const exchangeRateStore = readable(NaN, function start(set) {
	fetchForNow('EUR=X').then(set);
});

export const stockPriceStore = readable(NaN, function start(set) {
	fetchForNow('DT').then(set);
});

export const annualGrossStore = derived([stocksStore, stockPriceStore], ([$stocks, $price]) => {
	if (!$stocks.rsu.stocks.length) {
		return 0;
	} else if (isNaN($price)) {
		return NaN;
	}
	return $stocks.rsu.stocks
		.map((rsu) => ((rsu.count * $price) / getDurationInMonths(rsu)) * 12)
		.reduce((a, b) => a + b);
});
export const settingsStore = createPersistentStore<Settings>('settings', { incomeTax: 0.48, hideDisclaimer: false });
export const taxStore = derived(settingsStore, ($settingsStore) => $settingsStore.incomeTax);
