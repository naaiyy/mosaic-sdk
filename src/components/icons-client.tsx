"use client";

import * as PhosphorIcons from "@phosphor-icons/react";
import type { IconProps as PhosphorIconProps } from "@phosphor-icons/react";
import { forwardRef } from "react";

// Direct re-export of Phosphor Icon components
// Since we're in a client component, we can safely use these icons

// These are the most commonly used icons in the app
export const {
	House,
	CaretDoubleLeft,
	CaretDoubleRight,
	CaretRight,
	Plus,
	CircleNotch,
	Circle,
	Moon,
	Sun,
	Files,
	ArrowClockwise,
	CalendarBlank,
	Clock,
	Tag,
	// Add more common icons as needed
} = PhosphorIcons;

// Export general icon component props for reuse
export type IconProps = PhosphorIconProps;

// Create a type for valid icon names
export type PhosphorIconName = keyof typeof PhosphorIcons;

/**
 * Options for icon component creation
 */
export interface IconComponentOptions {
	/**
	 * Optional fallback icon to use when requested icon is not found
	 */
	fallbackIcon?: React.FC<IconProps>;

	/**
	 * Whether to throw an error instead of returning null/fallback
	 * @default false
	 */
	throwOnError?: boolean;

	/**
	 * Whether to log errors to console
	 * @default true
	 */
	logErrors?: boolean;
}

/**
 * Utility function to create a client-only icon component from any icon name
 * @param iconName - The name of the icon to retrieve from PhosphorIcons
 * @param options - Configuration options for error handling and fallbacks
 * @returns The icon component, fallback, or null if not found (or throws if throwOnError is true)
 */
export function createIconComponent(
	iconName: string,
	options: IconComponentOptions = {},
): React.FC<IconProps> | null {
	const {
		fallbackIcon = null,
		throwOnError = false,
		logErrors = true,
	} = options;

	// Helper function to handle errors consistently
	const handleError = (message: string): React.FC<IconProps> | null => {
		if (logErrors) {
			console.error(message);
		}

		if (throwOnError) {
			throw new Error(message);
		}

		return fallbackIcon;
	};

	// Skip utility exports that aren't icons
	if (["IconContext", "Icon", "createIcon"].includes(iconName)) {
		return handleError(`"${iconName}" is not an icon component`);
	}

	// Check if icon exists
	const iconComponent = PhosphorIcons[iconName as keyof typeof PhosphorIcons];
	if (!iconComponent) {
		return handleError(`Icon "${iconName}" not found in Phosphor Icons`);
	}

	// Return as React component
	return iconComponent as React.FC<IconProps>;
}
