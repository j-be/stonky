interface Stock {
	count: number;
	type: StockType;
}

export type StockType = 'rsu' | 'espp';

export type TemporalUnit = 'months';

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
