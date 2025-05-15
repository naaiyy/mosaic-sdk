"use server";

import { MosaicClient } from "../client/mosaic-client";
import type {
	MosaicConfig,
	MosaicPostResponse,
	MosaicPostsResponse,
} from "../types/types";

/**
 * Get a list of blog posts
 */
export async function getPosts(
	config: MosaicConfig,
	options: {
		path?: string;
		page?: number;
		limit?: number;
		category?: string;
	} = {},
): Promise<MosaicPostsResponse> {
	const client = new MosaicClient(config);
	return client.getPosts(options);
}

/**
 * Get a single blog post by slug
 */
export async function getPost(
	config: MosaicConfig,
	slug: string,
): Promise<MosaicPostResponse> {
	const client = new MosaicClient(config);
	return client.getPost(slug);
}

/**
 * Register a route as a destination
 * Used for auto-discovery of destinations
 */
export async function registerDestination(
	config: MosaicConfig,
	options: {
		path: string;
		type?: "list" | "post" | "category";
		name?: string;
	},
): Promise<{ success: boolean; message?: string }> {
	const client = new MosaicClient(config);
	return client.registerDestination(options);
}
