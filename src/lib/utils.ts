import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine and merge class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Check if a path is a dynamic route (contains [param] segments)
 */
export function isDynamicRoute(path: string): boolean {
	return path.includes("[") && path.includes("]");
}

/**
 * Extracts parameter names from a dynamic route
 * e.g. /blog/[slug] -> ["slug"]
 */
export function extractRouteParams(path: string): string[] {
	const params: string[] = [];
	const segments = path.split("/");

	for (const segment of segments) {
		if (segment.startsWith("[") && segment.endsWith("]")) {
			params.push(segment.slice(1, -1));
		}
	}

	return params;
}
