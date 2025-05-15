/**
 * Type definitions for Next.js fetch with cache/revalidation options
 */
export type NextFetchOptions = RequestInit & {
	next?: {
		revalidate?: number;
		tags?: string[];
	};
};

/**
 * Wrapper for fetch that allows Next.js specific options
 */
export async function nextFetch(
	url: string,
	options?: NextFetchOptions,
): Promise<Response> {
	// @ts-ignore - Next.js fetch has extra options
	return fetch(url, options);
}
