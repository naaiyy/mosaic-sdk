"use client";

import { ContentCard } from "@/components/content-card";
import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import dynamic from "next/dynamic";

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

// Variants for the blog content styling
const blogContentVariants = cva("prose dark:prose-invert", {
	variants: {
		size: {
			sm: "prose-sm",
			md: "prose-base",
			lg: "prose-lg",
		},
		spacing: {
			compact: "space-y-2",
			normal: "space-y-4",
			relaxed: "space-y-6",
		},
	},
	defaultVariants: {
		size: "md",
		spacing: "normal",
	},
});

// Omit content from HTMLAttributes to avoid conflict
type BlogContentCardBaseProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	"content"
>;

export interface BlogContentCardProps
	extends BlogContentCardBaseProps,
		VariantProps<typeof blogContentVariants> {
	content: string | TiptapContent;
	cardSize?: "sm" | "md" | "lg";
	cardVariant?: "default" | "subtle" | "outline" | "elevated";
	container?: boolean;
	maxWidth?: "auto" | "full" | "content";
}

export default function BlogContentCard({
	content,
	className,
	size,
	spacing,
	cardSize = "md",
	cardVariant = "default",
	container = true,
	maxWidth = "content",
	...props
}: BlogContentCardProps) {
	// Check if content is a string and parse it if needed
	const contentData =
		typeof content === "string" ? JSON.parse(content) : content;

	return (
		<ContentCard
			className={cn("overflow-hidden", className)}
			size={cardSize}
			variant={cardVariant}
			container={container}
			width={maxWidth}
			{...props}
		>
			<div className={cn(blogContentVariants({ size, spacing }))}>
				<TiptapRenderer content={contentData} />
			</div>
		</ContentCard>
	);
}
