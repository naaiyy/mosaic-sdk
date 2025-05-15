/**
 * Core types for the Mosaic SDK
 */

// API response types - Used for API communication
export interface MosaicPost {
	id: number;
	title: string;
	slug: string;
	content: { type: string; content?: unknown[]; [key: string]: unknown }; // Tiptap JSON content
	excerpt?: string;
	featuredImage?: string;
	status: string;
	labels: string[];
	seoTitle?: string;
	seoDescription?: string;
	publishedAt?: string;
	authorId: string;
}

export interface MosaicPostsResponse {
	posts: MosaicPost[];
	pagination: {
		page: number;
		limit: number;
		totalItems: number;
		hasMore: boolean;
	};
}

export interface MosaicPostResponse {
	post: MosaicPost;
}

/**
 * Types for structured data that will be serialized to JSON strings
 */

// Type for post labels
export type PostLabel = string;

// Type for publish destinations
export interface PublishDestination {
	id: string | number;
	name: string;
	type: string;
	status?: string;
}

/**
 * UI-ready blog post type used by the components
 * This is derived from MosaicPost but with fields optimized for UI rendering
 */
export interface BlogPost {
	id: number;
	title: string;
	slug: string;
	content: string;
	excerpt?: string | null;
	featuredImage?: string | null;
	status: string;

	/**
	 * JSON string of labels
	 * @example JSON.parse(labels) => PostLabel[]
	 */
	labels?: string | null;

	/**
	 * Parsed labels (use this when available instead of parsing the JSON string)
	 * Will be null when labels is null, undefined when not yet parsed
	 */
	parsedLabels?: PostLabel[] | null;

	seoTitle?: string | null;
	seoDescription?: string | null;

	/**
	 * JSON string of publish destinations
	 * @example JSON.parse(publishDestinations) => PublishDestination[]
	 * @deprecated Use parsedDestinations instead - this will be made optional in a future version
	 */
	publishDestinations: string;

	/**
	 * Parsed publish destinations
	 * This field should always be populated when the object is created
	 * at the data boundary by parsing publishDestinations
	 */
	parsedDestinations: PublishDestination[];

	projectId: number;
	authorId: string;
	publishedAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

// Configuration types
export interface MosaicConfig {
	/**
	 * Base URL for the Mosaic API (e.g., 'https://your-past-instance.com/api/v1')
	 */
	apiUrl: string;

	/**
	 * Optional API key for authenticated operations
	 */
	apiKey?: string;

	/**
	 * Site information
	 */
	site?: {
		/**
		 * The name of your site
		 */
		name?: string;

		/**
		 * The domain of your site (e.g., 'https://example.com')
		 */
		domain?: string;

		/**
		 * Default blog path (e.g., '/blog')
		 */
		defaultPath?: string;
	};

	/**
	 * Explicitly defined routes instead of auto-detection
	 */
	routes?: MosaicRoute[];

	/**
	 * Whether to automatically detect and register routes
	 * @default true
	 */
	autoDetectRoutes?: boolean;
}

export interface MosaicRoute {
	/**
	 * The path pattern (e.g., '/blog', '/blog/{slug}')
	 */
	path: string;

	/**
	 * The type of route
	 */
	type: "list" | "post" | "category";

	/**
	 * Optional display name
	 */
	name?: string;
}

// Component prop types
export interface MosaicBlogListProps {
	/**
	 * The path to fetch posts for, defaults to '/blog'
	 */
	path?: string;

	/**
	 * Number of posts to fetch
	 * @default 10
	 */
	limit?: number;

	/**
	 * Current page number
	 * @default 1
	 */
	page?: number;

	/**
	 * Category filter (if applicable)
	 */
	category?: string;

	/**
	 * Custom renderer for each post item
	 */
	renderItem?: (post: MosaicPost) => React.ReactNode;

	/**
	 * Additional CSS class name
	 */
	className?: string;
}

export interface MosaicBlogPostProps {
	/**
	 * The slug of the post to fetch
	 */
	slug: string;

	/**
	 * Fallback content to display if post is not found
	 */
	fallback?: React.ReactNode;

	/**
	 * Additional CSS class name
	 */
	className?: string;
}

// Tiptap content type (from the renderer)
export interface TiptapContent {
	type: string;
	content?: Array<{
		type: string;
		content?: Array<{
			type: string;
			text?: string;
			[key: string]: unknown;
		}>;
		[key: string]: unknown;
	}>;
	meta?: {
		isFullWidth?: boolean;
		[key: string]: unknown;
	};
	[key: string]: unknown;
}
