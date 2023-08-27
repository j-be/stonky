// const BASE_URL = 'https://query2.finance.yahoo.com/v8/finance/chart/DT';
const BASE_URL = 'https://yfinance.great-horned-owl.dedyn.io/v8/finance/chart';

const nowCache = new Map<string, Promise<number>>();

export const fetchForDateString = (dateString: string, symbol: string): Promise<number> => {
	const key = `adjclose-${symbol}-${dateString}`;
	const cached = Number(localStorage?.getItem(key));
	if (cached) {
		return Promise.resolve(cached);
	}
	return fetchForDate(new Date(dateString).getTime() / 1000, symbol)
		.then(fetched => {
			if (fetched && localStorage) {
				localStorage?.setItem(key, String(fetched));
			}
			return fetched;
		})
	;
}

export const fetchForNow = (symbol: string): Promise<number> => {
	const cached = nowCache.get(symbol);
	if (cached) {
		return Promise.resolve(cached);
	}
	const prom = fetchForDate(new Date().getTime() / 1000 - 24 * 60 * 60, symbol);
	nowCache.set(symbol, prom);
	return prom;
}

export const fetchForDate = (epoch: number, symbol: string) => fetchForPeriod(epoch + 4 * 60 * 60, epoch + 28 * 60 * 60, symbol);

const fetchForPeriod = (epochStart: number, epochEnd: number, symbol: string): Promise<number> =>
	fetch(`${BASE_URL}/${symbol}?period1=${Math.floor(epochStart)}&period2=${Math.ceil(epochEnd)}&interval=1d&includePrePost=False&events=div%2Csplits%2CcapitalGains`)
		.then(response => response.json())
		.then(data => data.chart.result[0].indicators.adjclose[0].adjclose)
		.then(adjclose => adjclose[adjclose.length - 1])

		// 36.01
		// 52.80
