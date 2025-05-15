"use client";

import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "../lib/utils";

const contentCardVariants = cva(
	"relative overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all",
	{
		variants: {
			size: {
				sm: "p-4",
				md: "p-6",
				lg: "p-8",
			},
			width: {
				auto: "w-auto",
				full: "w-full",
				content: "max-w-prose",
			},
			variant: {
				default: "bg-card",
				subtle: "bg-muted/30",
				outline: "border-border bg-transparent",
				elevated: "bg-card shadow-md hover:shadow-lg",
			},
		},
		defaultVariants: {
			size: "md",
			width: "full",
			variant: "default",
		},
	},
);

export interface ContentCardProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof contentCardVariants> {
	container?: boolean;
}

export function ContentCard({
	className,
	size,
	width,
	variant,
	container = true,
	children,
	...props
}: ContentCardProps) {
	return (
		<div
			className={cn(
				contentCardVariants({ size, width, variant }),
				container && "mx-auto",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
