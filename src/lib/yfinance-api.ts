import { addDays, subDays, format } from 'date-fns';
import { YFinanceDB } from './persistence/db';
import { storageReadWrite } from './persistence/storage';

// const BASE_URL = 'https://query2.finance.yahoo.com/v8/finance/chart/DT';
const BASE_URL = 'https://yfinance.great-horned-owl.dedyn.io/v8/finance/chart';

export const fetchForDateString = async (dateString: string, symbol: string): Promise<number> => {
	let db: YFinanceDB | null = null;
	try {
		db = await YFinanceDB.init();
	} catch (error) {
		console.warn('Cannot init DB:', error);
	}

	const cached = await db?.get({ date: dateString, symbol });
	if (cached) {
		return cached;
	}

	const fetched = await fetchForDate(new Date(dateString), symbol);
	if (fetched && db) {
		db.save({ date: dateString, symbol, value: fetched });
	}
	return fetched;
};

export const fetchForNow = async (symbol: string): Promise<number> => {
	const today = new Date();
	const date = format(today, 'yyyy-MM-dd');
	const [read, write] = storageReadWrite<{ date: string; value: number }>(`currentPrice-${symbol}`);

	const cached = read();
	if (cached?.date === date) {
		return cached.value;
	}

	const value = await fetchForDate(today, symbol);
	if (value) {
		write({ date, value });
	}
	return value;
};

const toEpoch = (date: Date): number => Math.floor(date.getTime() / 1000);

export const fetchForDate = async (date: Date, symbol: string): Promise<number> => {
	const period1 = toEpoch(subDays(date, 7));
	const period2 = toEpoch(addDays(date, 1));

	try {
		const response = await fetch(
			`${BASE_URL}/${symbol}` +
				`?period1=${period1}` +
				`&period2=${period2}` +
				`&interval=1d` +
				`&includePrePost=false`,
		);

		if (!response.ok) {
			return Number.NaN;
		}

		const result = (await response.json())?.chart?.result?.[0];
		if (!result) {
			return Number.NaN;
		}

		const wantedDate = date.toISOString().slice(0, 10);
		const timestamps: number[] = result.timestamp ?? [];
		const closes: (number | null)[] = result.indicators.quote?.[0]?.close ?? [];

		let previousClose: number | undefined;

		for (let i = 0; i < timestamps.length; i++) {
			const close = closes[i];
			if (close == null) {
				continue;
			}

			const candleDate = new Date(timestamps[i] * 1000).toISOString().slice(0, 10);
			if (candleDate === wantedDate) {
				return close;
			}

			if (candleDate > wantedDate) {
				break;
			}

			previousClose = close;
		}
		// Weekend / holiday -> latest previous trading close.
		return previousClose ?? Number.NaN;
	} catch {
		return Number.NaN;
	}
};
