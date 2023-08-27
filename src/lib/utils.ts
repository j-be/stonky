import { add, format, isPast } from 'date-fns';
import type { Duration } from './model';

export const getDate = (startDate: string, i: number, duration: Duration) => {
	const dur = { months: 0 };
	dur[duration.unit] = i * duration.amount;
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
