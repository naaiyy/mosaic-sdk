import { Files } from "@phosphor-icons/react/dist/ssr";
import PostCard from "~/components/MosaicBlogCard";

// Define proper type for blog posts based on the schema
export interface BlogPost {
	id: number;
	title: string;
	slug: string;
	content: string;
	excerpt?: string | null;
	featuredImage?: string | null;
	status: string;
	labels?: string | null; // JSON string of labels
	seoTitle?: string | null;
	seoDescription?: string | null;
	publishDestinations: string; // JSON string of destinations
	projectId: number;
	authorId: string;
	publishedAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

interface PostListProps {
	posts: BlogPost[] | undefined;
	error?: string;
}

export default function PostList({ posts, error }: PostListProps) {
	if (error) {
		return (
			<div className="flex h-96 w-full items-center justify-center">
				<p className="text-muted-foreground">Error loading posts: {error}</p>
			</div>
		);
	}

	if (!posts || posts.length === 0) {
		return (
			<div className="flex h-96 w-full flex-col items-center justify-center gap-4">
				<Files className="h-12 w-12 text-muted-foreground" />
				<p className="text-muted-foreground">
					No posts found for this category
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{posts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</div>
	);
}
