"use server";

// Export server actions
export { getPosts, getPost, registerDestination } from "./server/actions";

// Re-export fetch utilities for server usage
export { nextFetch } from "./lib/fetch-utils";
