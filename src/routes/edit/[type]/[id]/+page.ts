import { isStockType } from '$lib/model';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	if (!isStockType(params.type)) {
		throw error(404, 'Unknown type');
	}
	if (isNaN(+params.id) || +params.id < 0) {
		throw error(404, 'Invalid ID');
	}

	return {
		type: params.type,
		id: Number(params.id),
	};
}
