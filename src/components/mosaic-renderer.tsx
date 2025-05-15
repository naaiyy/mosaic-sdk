"use client";

import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";
// Import essential Tiptap packages
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect } from "react";
import ImageResize from "tiptap-extension-resize-image";

// Import the same styles used by the editor
import "../styles/code-block-node.scss";
import "../styles/list-node.scss";
import "../styles/image-node.scss";
import "../styles/paragraph-node.scss";

// Defined type for Tiptap content structure
interface TiptapContent {
	type: string;
	content?: Array<{
		type: string;
		content?: Array<{
			type: string;
			text?: string;
			[key: string]: unknown;
		}>;
		[key: string]: unknown;
	}>;
	meta?: {
		isFullWidth?: boolean;
		[key: string]: unknown;
	};
	[key: string]: unknown;
}

interface TiptapRendererProps {
	content: TiptapContent;
	className?: string;
}

export default function TiptapRenderer({
	content,
	className,
}: TiptapRendererProps) {
	// Configure the editor with the same extensions used in the real editor
	const editor = useEditor({
		extensions: [
			// Configure StarterKit with the same options as in useEditorConfig
			StarterKit.configure({
				bulletList: {
					HTMLAttributes: {
						class: "tiptap-bullet-list",
					},
				},
				orderedList: {
					HTMLAttributes: {
						class: "tiptap-ordered-list",
					},
				},
				listItem: {
					HTMLAttributes: {
						class: "tiptap-list-item",
					},
				},
				code: {
					HTMLAttributes: {
						class: "tiptap-code",
					},
				},
				heading: {
					levels: [1, 2, 3, 4, 5, 6],
				},
			}),

			// Image support with resizing
			ImageResize.configure({
				allowBase64: true,
				HTMLAttributes: {
					class: "tiptap-image",
				},
			}),

			// Lists and tasks
			TaskList,
			TaskItem.configure({ nested: true }),

			// Text formatting
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Underline,
			Highlight.configure({ multicolor: true }),
			Typography,
			Superscript,
			Subscript,

			// Links
			Link.configure({ openOnClick: true }),
		],
		content: content,
		editable: false,
	});

	// Update content when it changes
	useEffect(() => {
		if (editor && content) {
			editor.commands.setContent(content);
		}
	}, [content, editor]);

	return (
		<div className={className}>
			<EditorContent editor={editor} />
		</div>
	);
}
