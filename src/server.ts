"use server";

import { MosaicClient } from "./client/mosaic-client";
import { createMosaicConfig } from "./config/configuration";
import type {
	MosaicConfig,
	MosaicPostResponse,
	MosaicPostsResponse,
} from "./types/types";

/**
 * Type definitions for Next.js fetch with cache/revalidation options
 */
export type NextFetchOptions = RequestInit & {
	next?: {
		revalidate?: number;
		tags?: string[];
	};
};

/**
 * Wrapper for fetch that allows Next.js specific options
 */
export async function nextFetch(
	url: string,
	options?: NextFetchOptions,
): Promise<Response> {
	// @ts-ignore - Next.js fetch has extra options
	return fetch(url, options);
}

/**
 * Get a list of blog posts
 */
export async function getPosts(
	config: Partial<MosaicConfig>,
	options: {
		path?: string;
		page?: number;
		limit?: number;
		category?: string;
	} = {},
): Promise<MosaicPostsResponse> {
	const fullConfig = createMosaicConfig(config);
	const client = new MosaicClient(fullConfig);
	return client.getPosts(options);
}

/**
 * Get a single blog post by slug
 */
export async function getPost(
	config: Partial<MosaicConfig>,
	slug: string,
): Promise<MosaicPostResponse> {
	const fullConfig = createMosaicConfig(config);
	const client = new MosaicClient(fullConfig);
	return client.getPost(slug);
}

/**
 * Register a route as a destination
 * Used for auto-discovery of destinations
 */
export async function registerDestination(
	config: Partial<MosaicConfig>,
	options: {
		path: string;
		type?: "list" | "post" | "category";
		name?: string;
	},
): Promise<{ success: boolean; message?: string }> {
	const fullConfig = createMosaicConfig(config);
	const client = new MosaicClient(fullConfig);
	return client.registerDestination(options);
}
