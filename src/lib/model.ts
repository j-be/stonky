interface Stock {
	count: number;
	type: StockType;
}

const ALL_STOCK_TYPES = ['rsu', 'espp'] as const;
export type StockType = (typeof ALL_STOCK_TYPES)[number];

export const isStockType = (value: string): value is StockType => {
	return ALL_STOCK_TYPES.includes(value as StockType);
};

export type TemporalUnit = 'months' | 'years' | 'quarters';

export interface Duration {
	amount: number;
	unit: TemporalUnit;
}

export interface Vesting {
	duration: Duration;
	percentage: number;
}

export interface RestrictedStockUnits extends Stock {
	type: 'rsu';
	granted: string;
	firstVest: Vesting;
	subsequentVests: Vesting;
}

export interface EmployeeStockPurchase extends Stock {
	type: 'espp';
	periodStart: string;
	periodEnd: string;
}

export interface RsuVest {
	count: number;
	date: { dateString: string; isInPast: boolean };
}
