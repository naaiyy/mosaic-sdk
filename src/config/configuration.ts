"use client";

import { MosaicClient } from "../client/mosaic-client";
import type { MosaicConfig, MosaicRoute } from "../types/types";

// Global client instance
let globalClient: MosaicClient | null = null;
let globalConfig: MosaicConfig | null = null;

/**
 * Configure the Mosaic SDK
 * This should be called once at the application level
 */
export function configureMosaic(config: MosaicConfig) {
	// Set defaults
	const fullConfig: MosaicConfig = {
		...config,
		site: {
			name: config.site?.name || "Mosaic Site",
			domain:
				config.site?.domain ||
				(typeof window !== "undefined" ? window.location.origin : ""),
			defaultPath: config.site?.defaultPath || "/blog",
			...config.site,
		},
		autoDetectRoutes: config.autoDetectRoutes !== false, // Default to true
	};

	// Create a new client instance
	const client = new MosaicClient(fullConfig);

	// Store globally for reuse
	globalClient = client;
	globalConfig = fullConfig;

	// Register explicit routes if provided
	if (fullConfig.routes?.length && fullConfig.apiKey) {
		// In production, we'd want to debounce/batch these registrations
		for (const route of fullConfig.routes) {
			client.registerDestination({
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
		getClient: () => client,

		/**
		 * Get the current configuration
		 */
		getConfig: () => fullConfig,

		/**
		 * Register a new route as a destination
		 */
		registerRoute: (route: MosaicRoute) => {
			return client.registerDestination({
				path: route.path,
				type: route.type,
				name: route.name,
			});
		},
	};
}

/**
 * Get the global Mosaic client instance
 * Must call configureMosaic first
 */
export function getMosaicClient(): MosaicClient {
	if (!globalClient) {
		throw new Error("Mosaic SDK not configured. Call configureMosaic first.");
	}
	return globalClient;
}

/**
 * Get the global Mosaic configuration
 * Must call configureMosaic first
 */
export function getMosaicConfig(): MosaicConfig {
	if (!globalConfig) {
		throw new Error("Mosaic SDK not configured. Call configureMosaic first.");
	}
	return globalConfig;
}

/**
 * Utility: Auto-detect and register the current route
 * This is used by the components to auto-register themselves
 */
export function detectAndRegisterCurrentRoute(type: "list" | "post" = "list") {
	if (typeof window === "undefined") return; // Server-side, skip

	const client = getMosaicClient();
	const config = getMosaicConfig();

	if (!config.autoDetectRoutes || !config.apiKey) return;

	// Get current path
	const path = window.location.pathname;

	// Check local storage to avoid re-registering
	const storageKey = "mosaic_registered_routes";
	const registeredRoutes = JSON.parse(localStorage.getItem(storageKey) || "[]");

	if (registeredRoutes.includes(path)) return;

	// Register the route
	client
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
