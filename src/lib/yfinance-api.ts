import { addDays, addHours, format } from 'date-fns';
// const BASE_URL = 'https://query2.finance.yahoo.com/v8/finance/chart/DT';
const BASE_URL = 'https://yfinance.great-horned-owl.dedyn.io/v8/finance/chart';

export const fetchForDateString = (dateString: string, symbol: string): Promise<number> => {
	const key = `adjclose-${symbol}-${dateString}`;
	const cached = Number(localStorage?.getItem(key));
	if (cached) {
		return Promise.resolve(cached);
	}
	return fetchForDate(new Date(dateString), symbol).then((fetched) => {
		if (fetched && localStorage) {
			localStorage?.setItem(key, String(fetched));
		}
		return fetched;
	});
};

export const fetchForNow = (symbol: string): Promise<number> => {
	return fetchForDate(addDays(new Date(), -1), symbol);
};

const toEpoch = (date: Date): number => Math.floor(date.getTime() / 1000);

const fetchForDate = (date: Date, symbol: string) => {
	const epochStart = toEpoch(addHours(date, 4));
	const epochEnd = toEpoch(addDays(date, 1));
	return fetch(
		`${BASE_URL}/${symbol}?period1=${epochStart}&period2=${epochEnd}
		&interval=1d&includePrePost=False&events=div%2Csplits%2CcapitalGains`,
	)
		.then((response) => response.json())
		.then((data) => data.chart.result[0].indicators.adjclose[0].adjclose)
		.then((adjclose) => adjclose[adjclose.length - 1]);
};
