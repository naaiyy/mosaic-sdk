# Mosaic SDK

A lightweight SDK for integrating with PAST Mosaic CMS, allowing you to easily display blog posts and content from your Mosaic instance in any React or Next.js application.

## Features

- 🚀 **Simple Integration**: Add Mosaic content to your application with minimal setup
- 🔄 **Automatic Registration**: Routes are automatically registered as destinations in Mosaic CMS
- 🧩 **Ready-to-use Components**: Pre-built components for displaying blog posts and content
- ✨ **Rich Content Rendering**: Built-in support for Tiptap content with proper styling
- 🔍 **TypeScript Support**: Full type definitions for better development experience

## Installation

```bash
# Using npm
npm install @pastapp/mosaic

# Using pnpm
pnpm add @pastapp/mosaic

# Using yarn
yarn add @pastapp/mosaic
```

## Quick Start

### 1. Configure the SDK

Create a configuration file (e.g., `mosaic-config.ts`):

```typescript
import { configureMosaic } from '@pastapp/mosaic';

export const mosaicConfig = configureMosaic({
  apiUrl: process.env.NEXT_PUBLIC_MOSAIC_API_URL || 'http://localhost:3001/api',
  apiKey: process.env.MOSAIC_API_KEY,
  site: {
    domain: 'yourdomain.com',
    name: 'Your Site Name',
  },
});

// This will create an instance of the MosaicClient
export const mosaicClient = mosaicConfig.client;
```

### 2. Display a Blog List

```tsx
'use client';

import { MosaicBlogList } from '@pastapp/mosaic';
import { useEffect, useState } from 'react';
import { mosaicClient } from '@/config/mosaic-config';
import type { BlogPost } from '@pastapp/mosaic';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await mosaicClient.getPosts();
        setPosts(response.posts);
      } catch (err) {
        setError('Failed to load posts');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return <MosaicBlogList posts={posts} />;
}
```

### 3. Display a Single Blog Post

```tsx
'use client';

import { MosaicBlogContent, MosaicPageContainer } from '@pastapp/mosaic';
import { useEffect, useState } from 'react';
import { mosaicClient } from '@/config/mosaic-config';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await mosaicClient.getPost(params.slug);
        setPost(response.post);
      } catch (err) {
        setError('Failed to load post');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <MosaicPageContainer 
        content={post.content} 
        size="md" 
        spacing="relaxed" 
      />
    </div>
  );
}
```

## API Reference

### Components

#### `MosaicBlogList`

Displays a grid of blog post cards.

```tsx
<MosaicBlogList posts={posts} error={errorMessage} />
```

#### `MosaicBlogCard`

Displays a single blog post card with title, excerpt, and metadata.

```tsx
<MosaicBlogCard post={post} className="custom-class" />
```

#### `MosaicBlogContent`

A simple component for rendering Tiptap content.

```tsx
<MosaicBlogContent content={post.content} />
```

#### `MosaicPageContainer`

A container component with styling options for wrapping blog content.

```tsx
<MosaicPageContainer 
  content={post.content} 
  size="md" 
  spacing="normal" 
  cardSize="md" 
  cardVariant="default" 
  maxWidth="content" 
/>
```

### Client API

#### `MosaicClient`

The main client for interacting with the Mosaic CMS API.

```typescript
const client = new MosaicClient({
  apiUrl: 'http://localhost:3001/api',
  apiKey: 'your-api-key',
  site: {
    domain: 'yourdomain.com',
  },
});

// Get a list of blog posts
const posts = await client.getPosts({
  page: 1,
  limit: 10,
  category: 'news',
});

// Get a single blog post by slug
const post = await client.getPost('example-post-slug');

// Register a destination
await client.registerDestination({
  path: '/blog',
  type: 'list',
  name: 'Blog List',
});
```

## Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `apiUrl` | `string` | URL of your Mosaic CMS API |
| `apiKey` | `string` | API key for authentication |
| `site.domain` | `string` | Domain of your site |
| `site.name` | `string` | Name of your site |

## Auto-discovery and Registration

The SDK can automatically register routes as destinations in the Mosaic CMS. To enable this feature, use the `configureMosaic` function:

```typescript
import { configureMosaic } from '@pastapp/mosaic';

export const mosaicConfig = configureMosaic({
  apiUrl: process.env.NEXT_PUBLIC_MOSAIC_API_URL,
  apiKey: process.env.MOSAIC_API_KEY,
  site: {
    domain: 'yourdomain.com',
    name: 'Your Site Name',
  },
  autoRegister: true, // Enable auto-registration
  routes: [
    {
      path: '/blog',
      type: 'list',
      name: 'Blog List',
    },
    {
      path: '/blog/[slug]',
      type: 'post',
      name: 'Blog Post',
    },
  ],
});
```

## License

MIT
