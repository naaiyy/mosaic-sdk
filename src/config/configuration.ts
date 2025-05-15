import type { MosaicConfig } from "../types/types.js";

/**
 * Create a standardized Mosaic configuration object
 * This function can be used in both client and server components
 */
export function createMosaicConfig(
	config: Partial<MosaicConfig>,
): MosaicConfig {
	return {
		apiUrl: config.apiUrl || "https://api.mosaic.example.com",
		apiKey: config.apiKey,
		site: {
			name: config.site?.name || "Mosaic Site",
			domain:
				config.site?.domain ||
				(typeof window !== "undefined" ? window.location.origin : ""),
			defaultPath: config.site?.defaultPath || "/blog",
			...config.site,
		},
		autoDetectRoutes: config.autoDetectRoutes !== false,
		routes: config.routes || [],
	};
}
