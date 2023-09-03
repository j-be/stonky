interface MarketPrice {
	date: string;
	symbol: string;
	value: number;
}
type ValueQuery = Omit<MarketPrice, 'value'>;

export class YFinanceDB {
	private static readonly MARKET_PRICES = 'MarketPrices';
	private static readonly GET_VALUE_INDEX = 'dateAndSymbol';

	private constructor(private db: IDBDatabase) {}

	public static init(): Promise<YFinanceDB> {
		if (typeof indexedDB === 'undefined' || !indexedDB) {
			return Promise.reject('IndexedDB is not supported!');
		}
		const request = indexedDB.open('yfinance-cache', 1);
		return new Promise((resolve, reject) => {
			request.onupgradeneeded = (event) => {
				console.log(`Upgrade DB form ${event.oldVersion} to ${event.newVersion}`);

				if (!event.target?.result) {
					reject(new Error('No DB to update'));
				}
				const db = event.target?.result;

				// Migrations
				if (event.oldVersion === 0) {
					YFinanceDB.migrateV0ToV1(db);
				}
			};
			request.onsuccess = (ev) => resolve(new YFinanceDB(ev.target?.result));
			request.onerror = (ev) => reject(ev.target?.error);
		});
	}

	public save(val: MarketPrice) {
		const transaction = this.db.transaction(YFinanceDB.MARKET_PRICES, 'readwrite');
		const store = transaction.objectStore(YFinanceDB.MARKET_PRICES);
		store.add(val);
		transaction.onerror = (ev) => console.error('Cannot save: ', ev.target?.error.message);
		transaction.commit();
	}

	public get(query: ValueQuery): Promise<number | null> {
		const transaction = this.db.transaction(YFinanceDB.MARKET_PRICES, 'readonly');
		const store = transaction.objectStore(YFinanceDB.MARKET_PRICES);
		return new Promise((resolve, reject) => {
			const request = store.index(YFinanceDB.GET_VALUE_INDEX).get([query.date, query.symbol]);
			request.onsuccess = (ev) => resolve((ev.target?.result as MarketPrice)?.value ?? null);
			transaction.onerror = (ev) => reject(ev.target?.error);
		});
	}

	private static migrateV0ToV1(db: IDBDatabase) {
		console.log('Migrating V0 to V1');
		// Create ObjectStore
		const objectStore = db.createObjectStore(YFinanceDB.MARKET_PRICES, { keyPath: 'id', autoIncrement: true });

		// Create ObjectStore
		const valueQueryColumns: (keyof ValueQuery)[] = ['date', 'symbol'];
		objectStore.createIndex(YFinanceDB.GET_VALUE_INDEX, valueQueryColumns, { unique: true });

		// Cleanup localStorage
		if (typeof localStorage !== 'undefined' && localStorage) {
			for (let i = localStorage.length - 1; i >= 0; i--) {
				const key = localStorage.key(i);
				if (key?.startsWith('adjclose-')) {
					localStorage.removeItem(key);
				}
			}
		}
	}
}
