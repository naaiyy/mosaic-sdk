import type { MosaicConfig } from "../types/types.js";

/**
 * Default route patterns used when none are specified
 */
export const DEFAULT_ROUTES = {
	list: "/blog",
	post: "/blog/:slug",
	category: "/blog/category/:category",
};

/**
 * Generate a URL based on the route type and parameters
 * @param config The Mosaic configuration
 * @param type The type of route (list, post, category)
 * @param params Parameters to replace in the route pattern
 * @returns The generated URL
 */
export function getRouteUrl(
	config: MosaicConfig,
	type: "list" | "post" | "category",
	params: Record<string, string> = {},
): string {
	// Find route pattern from config or use defaults
	let pattern = DEFAULT_ROUTES[type];

	// Check if the config has custom routes defined
	if (config.routes && config.routes.length > 0) {
		const customRoute = config.routes.find((route) => route.type === type);
		if (customRoute) {
			pattern = customRoute.path;
		}
	}

	// Replace parameters in the pattern
	let url = pattern;
	for (const [key, value] of Object.entries(params)) {
		url = url.replace(`:${key}`, value);
	}

	// Add trailing slash if needed
	return url;
}

/**
 * Get a URL to a blog post
 * @param config The Mosaic configuration
 * @param slug The post slug
 * @returns The post URL
 */
export function getBlogPostUrl(config: MosaicConfig, slug: string): string {
	return getRouteUrl(config, "post", { slug });
}

/**
 * Get a URL to a blog list page
 * @param config The Mosaic configuration
 * @returns The blog list URL
 */
export function getBlogListUrl(config: MosaicConfig): string {
	return getRouteUrl(config, "list");
}

/**
 * Get a URL to a blog category page
 * @param config The Mosaic configuration
 * @param category The category slug
 * @returns The category URL
 */
export function getBlogCategoryUrl(
	config: MosaicConfig,
	category: string,
): string {
	return getRouteUrl(config, "category", { category });
}
