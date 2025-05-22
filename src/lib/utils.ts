import { add, format, intervalToDuration, isPast } from 'date-fns';
import type { Duration, RestrictedStockUnits, RsuVest, VestDate } from './model';
import { fetchForDateString } from './yfinance-api';

export const flattenRsus = async (rsus: RestrictedStockUnits[]): Promise<{ vests: RsuVest[]; perMonth: number }> => {
	return Promise.all(rsus.map(flattenRsu))
		.then((listOfLists) =>
			listOfLists.reduce(
				(agg, current) => ({
					vests: agg.vests.concat(current.vests),
					perMonth: agg.perMonth + current.perMonth,
				}),
				{ vests: [], perMonth: 0 },
			),
		)
		.then((x) => ({
			...x,
			vests: x.vests.sort((a, b) => a.date.dateString.localeCompare(b.date.dateString)),
		}));
};

export const flattenRsu = async (rsu: RestrictedStockUnits): Promise<{ vests: RsuVest[]; perMonth: number }> => {
	const firstVestAmount = rsu.count * rsu.firstVest.percentage;
	const vests = [await vest(getDate(rsu.granted, 1, rsu.firstVest.duration), firstVestAmount)];

	const subsequentVestAmount = rsu.count * rsu.subsequentVests.percentage;
	let remainder = rsu.count - firstVestAmount;
	let vestDate = vests[0].date;
	while (remainder > 1) {
		vestDate = getDate(vestDate.dateString, 1, rsu.subsequentVests.duration);
		vests.push(await vest(vestDate, Math.min(remainder, subsequentVestAmount)));

		remainder -= subsequentVestAmount;
	}

	vests[vests.length - 1].last = true;

	const duration = intervalToDuration({
		start: new Date(rsu.granted),
		end: new Date(vests[vests.length - 1].date.dateString),
	});
	const durationMonths = (duration.years ?? 0) * 12 + (duration.months ?? 0);

	return { vests, perMonth: rsu.count / durationMonths };
};

const getDate = (startDate: string, i: number, duration: Duration) => {
	const dur = { months: 0, years: 0 };
	if (duration.unit == 'quarters') {
		dur.months = 3 * i * duration.amount;
	} else {
		dur[duration.unit] = i * duration.amount;
	}
	const date = add(new Date(startDate), dur);
	return {
		dateString: format(date, 'yyyy-MM-dd'),
		isInPast: isPast(date),
	};
};

const vest = async (date: VestDate, count: number): Promise<RsuVest> => {
	const priceAndExchangeRate = date.isInPast
		? {
				price: await fetchForDateString(date.dateString, 'DT'),
				exchangeRate: await fetchForDateString(date.dateString, 'EUR=X'),
			}
		: { price: null, exchangeRate: null };

	return {
		date,
		count,
		...priceAndExchangeRate,
	};
};

export const formatNumber = (value: number, digits = 2) => {
	if (isNaN(value)) {
		return '???';
	}

	return value.toLocaleString(undefined, {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
	});
};

const toMonths = (duration: Duration): number => {
	switch (duration.unit) {
		case 'months':
			return duration.amount;
		case 'years':
			return duration.amount * 12;
		case 'quarters':
			return duration.amount * 3;
	}
};

export const getDurationInMonths = (rsu: RestrictedStockUnits): number => {
	const numberOfSubsequent = (1 - rsu.firstVest.percentage) / rsu.subsequentVests.percentage;
	return toMonths(rsu.firstVest.duration) + toMonths(rsu.subsequentVests.duration) * numberOfSubsequent;
};
