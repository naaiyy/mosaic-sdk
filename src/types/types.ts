/**
 * Core types for the Mosaic SDK
 */

// API response types
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
