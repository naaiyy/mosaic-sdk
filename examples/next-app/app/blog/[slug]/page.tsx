import { configureMosaic } from "~/config/configuration";
import { MosaicPageContainer } from "~/index";

// Use this type to match what the MosaicPageContainer expects
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
import { CalendarBlank, Clock } from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import { notFound } from "next/navigation";

// Configure the Mosaic SDK
const mosaicConfig = configureMosaic({
	apiUrl: process.env.NEXT_PUBLIC_MOSAIC_API_URL || "http://localhost:3001/api",
	apiKey: process.env.MOSAIC_API_KEY,
	site: {
		domain: "example.com",
	},
	autoDetectRoutes: true,
});

// Get the client instance
const mosaicClient = mosaicConfig.getClient();

// Server action to fetch a single post
async function getBlogPost(slug: string) {
	"use server";

	try {
		const response = await mosaicClient.getPost(slug);

		if (!response.post) {
			return null;
		}

		return response.post;
	} catch (error) {
		console.error(`Failed to fetch post with slug ${slug}:`, error);
		return null;
	}
}

export default async function BlogPostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	// NextJS 15.3.1+ requires awaiting params in dynamic routes
	const { slug } = await params;

	const post = await getBlogPost(slug);

	if (!post) {
		notFound();
	}

	// Calculate estimated read time (roughly 200 words per minute)
	// Convert to string to safely calculate length if content is an object
	const contentString =
		typeof post.content === "string"
			? post.content
			: JSON.stringify(post.content);
	// Split by whitespace and filter out empty strings for a better word count
	const wordCount = contentString.split(/\s+/).filter(Boolean).length;
	const readTime = Math.max(1, Math.ceil(wordCount / 200));

	return (
		<article className="container mx-auto py-12 max-w-4xl">
			{/* Post Header */}
			<header className="mb-8">
				<h1 className="text-4xl font-bold mb-4">{post.title}</h1>

				{/* Post Meta */}
				<div className="flex items-center gap-6 text-muted-foreground text-sm">
					{post.publishedAt && (
						<div className="flex items-center gap-2">
							<CalendarBlank className="h-4 w-4" />
							<time dateTime={new Date(post.publishedAt).toISOString()}>
								{format(new Date(post.publishedAt), "MMMM d, yyyy")}
							</time>
						</div>
					)}

					<div className="flex items-center gap-2">
						<Clock className="h-4 w-4" />
						<span>{readTime} min read</span>
					</div>
				</div>
			</header>

			{/* Featured Image */}
			{post.featuredImage && (
				<div className="mb-10 aspect-video w-full overflow-hidden rounded-xl">
					<img
						src={post.featuredImage}
						alt={post.title}
						className="h-full w-full object-cover"
					/>
				</div>
			)}

			{/* Post Content */}
			<MosaicPageContainer
				content={
					typeof post.content === "string"
						? post.content
						: (post.content as TiptapContent)
				}
				size="lg"
				spacing="relaxed"
				cardVariant="default"
			/>
		</article>
	);
}

// Generate metadata for the page
export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = await getBlogPost(slug);

	if (!post) {
		return {
			title: "Post Not Found",
		};
	}

	return {
		title: post.seoTitle || post.title,
		description: post.seoDescription || post.excerpt,
		openGraph: {
			title: post.seoTitle || post.title,
			description: post.seoDescription || post.excerpt,
			images: post.featuredImage ? [post.featuredImage] : [],
		},
	};
}
