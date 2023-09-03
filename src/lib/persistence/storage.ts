const ephemeralStorage = new Map<string, unknown>();

export const storageReadWrite = <T>(key: string): [() => T | null, (_: T) => void] => {
	if (typeof localStorage === 'undefined' || !localStorage) {
		console.warn('LocalStorage is not available! Using ephemeral storage');
		return [() => (ephemeralStorage.get(key) as T) ?? null, (t: T) => ephemeralStorage.set(key, t)];
	}
	return [
		() => {
			try {
				return JSON.parse(localStorage.getItem(key) ?? 'null');
			} catch {
				localStorage.removeItem(key);
				return null;
			}
		},
		(value: T) => localStorage.setItem(key, JSON.stringify(value)),
	];
};
