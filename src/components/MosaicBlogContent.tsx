"use client";

import dynamic from "next/dynamic";

/**
 * MosaicBlogContent Component
 *
 * A simple component for rendering Tiptap JSON content with proper styling.
 * This component is optimized for blog content and automatically handles
 * parsing string content into the required format.
 *
 * @example
 * ```tsx
 * // With string content (JSON string)
 * <MosaicBlogContent content={post.content} />
 *
 * // With object content (parsed JSON)
 * <MosaicBlogContent content={parsedContent} />
 * ```
 */

// Dynamically import the Tiptap renderer to avoid SSR issues
const TiptapRenderer = dynamic(() => import("./mosaic-renderer"), {
	ssr: false,
});

// Import type from tiptap-renderer or create a type reference
type TiptapContent = {
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
};

/**
 * Props for the MosaicBlogContent component
 */
interface BlogContentProps {
	/**
	 * The Tiptap content to render
	 * Can be a JSON string or a parsed Tiptap content object
	 */
	content: string | TiptapContent;
}

/**
 * Renders Tiptap content with proper styling for blog posts
 * Automatically handles parsing string content if needed
 */
export default function BlogContent({ content }: BlogContentProps) {
	// Check if content is a string and parse it if needed
	const contentData =
		typeof content === "string" ? JSON.parse(content) : content;

	return (
		<div className="prose dark:prose-invert">
			<TiptapRenderer content={contentData} />
		</div>
	);
}
