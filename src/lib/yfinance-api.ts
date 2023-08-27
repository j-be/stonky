// const BASE_URL = 'https://query2.finance.yahoo.com/v8/finance/chart/DT';
const BASE_URL = 'https://yfinance.great-horned-owl.dedyn.io/v8/finance/chart/DT';

export const fetchForDateString = (dateString: string) => fetchForDate(new Date(dateString).getTime() / 1000);

export const fetchForDate = (epoch: number) => fetchForPeriod(epoch + 4 * 60 * 60, epoch + 28 * 60 * 60);

export const fetchForPeriod = (epochStart: number, epochEnd: number) =>
	fetch(`${BASE_URL}?period1=${Math.floor(epochStart)}&period2=${Math.ceil(epochEnd)}&interval=1d&includePrePost=False&events=div%2Csplits%2CcapitalGains`)
		.then(response => response.json())
		.then(data => data.chart.result[0].indicators.adjclose[0].adjclose)
		.then(adjclose => adjclose[adjclose.length - 1])


		// 36.01
		// 52.80
