import { nextFetch } from "../lib/fetch-utils.js";
import type {
	MosaicConfig,
	MosaicPostResponse,
	MosaicPostsResponse,
} from "../types/types.js";

/**
 * Mosaic API Client
 * Handles communication with the PAST Mosaic CMS API
 */
export class MosaicClient {
	private baseUrl: string;
	private apiKey?: string;
	private siteDomain?: string;

	constructor(config: MosaicConfig) {
		this.baseUrl = config.apiUrl.endsWith("/")
			? config.apiUrl.slice(0, -1)
			: config.apiUrl;
		this.apiKey = config.apiKey;
		this.siteDomain = config.site?.domain;
	}

	/**
	 * Get a list of blog posts
	 */
	async getPosts({
		path = "/blog",
		page = 1,
		limit = 10,
		category,
	}: {
		path?: string;
		page?: number;
		limit?: number;
		category?: string;
	} = {}): Promise<MosaicPostsResponse> {
		try {
			// Build the query parameters
			const queryParams = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			});

			if (category) {
				queryParams.append("category", category);
			}

			// Additional query params for destination filtering
			if (path) {
				queryParams.append("path", path);
			}

			if (this.siteDomain) {
				queryParams.append("domain", this.siteDomain);
			}

			// Make the request - avoid appending /blog if it's already in the baseUrl
			const endpoint = this.baseUrl.endsWith("/blog") ? "" : "/blog";
			const url = `${this.baseUrl}${endpoint}?${queryParams.toString()}`;
			const headers: HeadersInit = {
				"Content-Type": "application/json",
			};

			if (this.apiKey) {
				headers.Authorization = `Bearer ${this.apiKey}`;
			}

			const response = await nextFetch(url, {
				headers,
				next: { revalidate: 60 }, // Cache for 60 seconds
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch posts: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("Error fetching Mosaic posts:", error);
			return {
				posts: [],
				pagination: {
					page,
					limit,
					totalItems: 0,
					hasMore: false,
				},
			};
		}
	}

	/**
	 * Get a single blog post by slug
	 */
	async getPost(slug: string): Promise<MosaicPostResponse> {
		try {
			// Avoid appending /blog if it's already in the baseUrl
			const endpoint = this.baseUrl.endsWith("/blog") ? "" : "/blog";
			const url = `${this.baseUrl}${endpoint}/${slug}`;
			const headers: HeadersInit = {
				"Content-Type": "application/json",
			};

			if (this.apiKey) {
				headers.Authorization = `Bearer ${this.apiKey}`;
			}

			if (this.siteDomain) {
				headers["X-Site-Domain"] = this.siteDomain;
			}

			const response = await nextFetch(url, {
				headers,
				next: { revalidate: 60 }, // Cache for 60 seconds
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch post: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error(`Error fetching Mosaic post with slug ${slug}:`, error);
			// Return null post with correct type
			return { post: null as unknown as MosaicPostResponse["post"] };
		}
	}

	/**
	 * Register a route as a destination
	 * Used for auto-discovery of destinations
	 */
	async registerDestination({
		path,
		type = "list",
		name,
	}: {
		path: string;
		type?: "list" | "post" | "category";
		name?: string;
	}): Promise<{ success: boolean; message?: string }> {
		if (!this.apiKey) {
			console.warn("Cannot register destination without an API key");
			return { success: false, message: "API key required" };
		}

		if (!this.siteDomain) {
			console.warn("Cannot register destination without a site domain");
			return { success: false, message: "Site domain required" };
		}

		try {
			const response = await fetch(`${this.baseUrl}/destinations`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.apiKey}`,
				},
				body: JSON.stringify({
					path,
					type,
					name: name || `${this.siteDomain}${path}`,
					domain: this.siteDomain,
				}),
			});

			if (!response.ok) {
				throw new Error(`Failed to register destination: ${response.status}`);
			}

			return { success: true };
		} catch (error) {
			console.error("Error registering destination:", error);
			return {
				success: false,
				message: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}
}
