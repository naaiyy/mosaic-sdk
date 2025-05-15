"use client";

// Export all client components
export { default as MosaicBlogCard } from "./components/MosaicBlogCard";
export { default as MosaicBlogContent } from "./components/MosaicBlogContent";
export { default as MosaicBlogList } from "./components/MosaicBlogList";
export { default as MosaicPageContainer } from "./components/MosaicPageContainer";
export { default as TiptapRenderer } from "./components/mosaic-renderer";

// Export client-side utils
export { cn, isDynamicRoute, extractRouteParams } from "./lib/utils";

// Client-side configuration
import { MosaicClient } from "./client/mosaic-client";
import { createMosaicConfig } from "./config/configuration";
import type { MosaicConfig, MosaicRoute } from "./types/types";

// Client-side singleton (only works in client components)
let clientInstance: MosaicClient | null = null;
let clientConfig: MosaicConfig | null = null;

/**
 * Initialize the Mosaic client for client-side usage
 * This should be called in a client component
 */
export function initMosaicClient(config: Partial<MosaicConfig>) {
	const fullConfig = createMosaicConfig(config);
	clientConfig = fullConfig;

	// Create a new client instance
	clientInstance = new MosaicClient(fullConfig);

	// Register explicit routes if provided
	if (fullConfig.routes?.length && fullConfig.apiKey) {
		// In production, we'd want to debounce/batch these registrations
		for (const route of fullConfig.routes) {
			clientInstance.registerDestination({
				path: route.path,
				type: route.type,
				name: route.name,
			});
		}
	}

	return {
		/**
		 * Get the Mosaic client instance
		 */
		getClient: () => {
			if (!clientInstance) {
				throw new Error(
					"Mosaic client not initialized. Call initMosaicClient first.",
				);
			}
			return clientInstance;
		},

		/**
		 * Get the current configuration
		 */
		getConfig: () => {
			if (!clientConfig) {
				throw new Error(
					"Mosaic client not initialized. Call initMosaicClient first.",
				);
			}
			return clientConfig;
		},

		/**
		 * Register a new route as a destination
		 */
		registerRoute: (route: MosaicRoute) => {
			if (!clientInstance) {
				throw new Error(
					"Mosaic client not initialized. Call initMosaicClient first.",
				);
			}
			return clientInstance.registerDestination({
				path: route.path,
				type: route.type,
				name: route.name,
			});
		},
	};
}

/**
 * Utility: Auto-detect and register the current route
 * This is used by the components to auto-register themselves
 */
export function detectAndRegisterCurrentRoute(type: "list" | "post" = "list") {
	if (typeof window === "undefined" || !clientInstance || !clientConfig) return; // Server-side or not initialized, skip

	if (!clientConfig.autoDetectRoutes || !clientConfig.apiKey) return;

	// Get current path
	const path = window.location.pathname;

	// Check local storage to avoid re-registering
	const storageKey = "mosaic_registered_routes";
	const registeredRoutes = JSON.parse(localStorage.getItem(storageKey) || "[]");

	if (registeredRoutes.includes(path)) return;

	// Register the route
	clientInstance
		.registerDestination({ path, type })
		.then((result) => {
			if (result.success) {
				// Store in localStorage to avoid re-registering
				localStorage.setItem(
					storageKey,
					JSON.stringify([...registeredRoutes, path]),
				);
			}
		})
		.catch((err) => {
			console.error("Failed to auto-register route:", err);
		});
}
