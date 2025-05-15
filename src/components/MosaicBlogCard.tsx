"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/card";
import { cn } from "@/lib/utils";
import { CalendarBlank, Clock, Tag } from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import Link from "next/link";

import type { BlogPost } from "@/types/types";

interface PostCardProps {
	post: BlogPost;
	className?: string;
}

export default function PostCard({ post, className }: PostCardProps) {
	// Parse labels from JSON string
	const labels = post.labels ? JSON.parse(post.labels as string) : [];

	return (
		<Card
			className={cn(
				"h-full overflow-hidden transition-all hover:shadow-md",
				className,
			)}
		>
			<Link href={`/blog/post/${post.slug}`} className="group block h-full">
				{post.featuredImage && (
					<div className="aspect-video w-full overflow-hidden">
						<img
							src={post.featuredImage}
							alt={post.title}
							className="h-full w-full object-cover transition-transform group-hover:scale-105"
						/>
					</div>
				)}

				<CardHeader className="pb-3">
					<div className="space-y-1.5">
						{labels.length > 0 && (
							<div className="flex items-center gap-2 text-muted-foreground text-xs">
								<Tag className="h-3.5 w-3.5" />
								<span>{labels[0]}</span>
							</div>
						)}
						<h3 className="line-clamp-2 font-semibold text-lg leading-tight transition-colors group-hover:text-primary">
							{post.title}
						</h3>
					</div>
				</CardHeader>

				<CardContent className="pb-4">
					{post.excerpt && (
						<p className="line-clamp-3 text-muted-foreground text-sm">
							{post.excerpt}
						</p>
					)}
				</CardContent>

				<CardFooter className="border-t pt-4 text-muted-foreground text-xs">
					{post.publishedAt && (
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-1.5">
								<CalendarBlank className="h-3.5 w-3.5" />
								<span>{format(new Date(post.publishedAt), "MMM d, yyyy")}</span>
							</div>
							<div className="flex items-center gap-1.5">
								<Clock className="h-3.5 w-3.5" />
								<span>5 min read</span>
							</div>
						</div>
					)}
				</CardFooter>
			</Link>
		</Card>
	);
}
