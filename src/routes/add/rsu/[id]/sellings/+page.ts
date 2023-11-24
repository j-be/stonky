import { error } from '@sveltejs/kit';

export function load({ params }) {
	if (isNaN(+params.id) || +params.id < 0) {
		throw error(404, 'Invalid ID');
	}

	return {
		rsuId: Number(params.id),
	};
}
