import { MosaicBlogList, configureMosaic } from "@pastapp/mosaic";
import { ArrowClockwise } from "@phosphor-icons/react/dist/ssr";
import { Suspense } from "react";

// Configure the Mosaic SDK
const mosaicConfig = configureMosaic({
	apiUrl: process.env.NEXT_PUBLIC_MOSAIC_API_URL || "http://localhost:3001/api",
	apiKey: process.env.MOSAIC_API_KEY,
	site: {
		domain: "example.com",
	},
	// Auto-register routes
	autoDetectRoutes: true,
});

// Get the client instance
const mosaicClient = mosaicConfig.getClient();

// Server action to fetch posts
async function getBlogPosts(page = 1, limit = 12) {
	"use server";

	try {
		const response = await mosaicClient.getPosts({
			page,
			limit,
		});

		return {
			posts: response.posts,
			pagination: response.pagination,
		};
	} catch (error) {
		console.error("Failed to fetch posts:", error);
		throw new Error("Failed to load blog posts");
	}
}

export default async function BlogPage({
	searchParams,
}: {
	searchParams: { page?: string };
}) {
	const page = Number(searchParams.page) || 1;

	return (
		<div className="container mx-auto py-12">
			<h1 className="text-4xl font-bold mb-8">Blog</h1>

			<Suspense fallback={<BlogListSkeleton />}>
				<BlogPostsList page={page} />
			</Suspense>
		</div>
	);
}

// Component that loads the blog posts
async function BlogPostsList({ page }: { page: number }) {
	const { posts, pagination } = await getBlogPosts(page);

	if (!posts || posts.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
				<ArrowClockwise className="h-10 w-10 mb-4" />
				<p>No posts found</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<MosaicBlogList posts={posts} />

			{/* Pagination UI */}
			{pagination && pagination.totalPages > 1 && (
				<div className="flex justify-center gap-2 mt-8">
					{Array.from({ length: pagination.totalPages }).map((_, i) => {
						const pageNumber = i + 1;
						return (
							<a
								key={`page-${pageNumber}`}
								href={`/blog?page=${pageNumber}`}
								className={`px-4 py-2 rounded-md ${
									page === pageNumber
										? "bg-primary text-primary-foreground"
										: "bg-muted hover:bg-muted/80"
								}`}
							>
								{pageNumber}
							</a>
						);
					})}
				</div>
			)}
		</div>
	);
}

// Loading skeleton
function BlogListSkeleton() {
	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={`skeleton-${i}-${Date.now()}`}
					className="h-[320px] rounded-lg bg-muted animate-pulse"
				/>
			))}
		</div>
	);
}
