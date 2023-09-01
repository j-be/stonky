import { add, format, intervalToDuration, isPast } from 'date-fns';
import type { Duration, RestrictedStockUnits, RsuVest } from './model';

export const flattenRsu = (rsu: RestrictedStockUnits): { durationMonths: number; vests: RsuVest[] } => {
	const vests = [
		{
			date: getDate(rsu.granted, 1, rsu.firstVest.duration),
			count: rsu.count * rsu.firstVest.percentage,
		},
	];

	let vested = rsu.firstVest.percentage;
	let i = 0;
	while (Math.abs(vested - 1) > 0.0000001) {
		vested += rsu.subsequentVests.percentage;
		i++;

		vests.push({
			date: getDate(vests[0].date.dateString, i, rsu.subsequentVests.duration),
			count: rsu.count * rsu.subsequentVests.percentage,
		});
	}

	const duration = intervalToDuration({
		start: new Date(rsu.granted),
		end: new Date(vests[vests.length - 1].date.dateString),
	});
	const durationMonths = (duration.years ?? 0) * 12 + (duration.months ?? 0);

	return { durationMonths, vests };
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

export const formatNumber = (value: number, digits = 2) =>
	`${value.toLocaleString(undefined, {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
	})}`;
