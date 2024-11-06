'use client';
import React, { useState, useRef } from 'react';

interface MentionableEntity {
	id: number;
	name: string;
	type: EntityType;
}

type EntityType = 'employee' | 'team' | 'space';

// Define a color mapping for each entity type
const entityTypeColors: Record<EntityType, string> = {
	employee: '#62e78a', // Blue for users
	team: '#8692ee', // Green for projects
	space: '#df478e'
};

// Sample mentionable entities
const mentionableEntities: MentionableEntity[] = [
	{ id: 1, name: "Big7Solution", type: 'space' },
	{ id: 2, name: "Solution22", type: 'space' },
	{ id: 3, name: "Graphity", type: 'space' },
	{ id: 4, name: "DevelopmentTeam", type: 'team' },
	{ id: 5, name: "DesignTeam", type: 'team' },
	{ id: 6, name: "MangementTeam", type: 'team' },
	{ id: 7, name: "Dhanasekar", type: 'employee' },
	{ id: 8, name: "Prashanth", type: 'employee' },
	{ id: 9, name: "Pugal", type: 'employee' },
];

export default function MentionInput() {
	const [text, setText] = useState<string>('');
	const [suggestions, setSuggestions] = useState<MentionableEntity[]>([]);
	const [mentionStartIndex, setMentionStartIndex] = useState<number | null>(
		null
	);
	const [popupPosition, setPopupPosition] = useState({ top: 50, left: 0 });

	const editableRef = useRef<HTMLDivElement | null>(null);

	// Function to update text state and filter mentions based on typed input
	const handleInput = (e: any) => {
		if (editableRef.current) {
			const plainText = editableRef.current.innerText || '';

			// Check if we're in mention mode based on the cursor position
			let cursorPosition = (mentionStartIndex! + window.getSelection()?.focusOffset!) ?? 0;
			if (mentionStartIndex !== null && cursorPosition > mentionStartIndex) {
				const mentionQuery = plainText.slice(
					mentionStartIndex + 1,
					cursorPosition
				);
				const filteredSuggestions = mentionQuery.trim() && mentionableEntities.filter((entity) =>
					entity.name.toLowerCase().startsWith(mentionQuery.toLowerCase())
				);

				const range = window.getSelection()?.getRangeAt(0);
				const rect = range?.getBoundingClientRect();
				// setPopupPosition({
				//     top: rect?.top! + window.scrollY,
				//     left: rect?.left! + window.scrollX,
				// });

				setSuggestions(filteredSuggestions || []);

			} else {
				setSuggestions([]);
				setMentionStartIndex(null);
				cursorPosition = 0
			}
		}
	};

	// Function to handle selecting a mention from the suggestions
	const selectMention = (entity: MentionableEntity) => {
		if (mentionStartIndex !== null && editableRef.current) {

			// Step 1: Get innerHTML and create a temporary DOM structure
			const originalHTML = editableRef.current.innerHTML;
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = originalHTML;

			// Step 2: Extract text content and find the position of '@'
			const textContent = tempDiv.textContent || '';
			const atIndex = mentionStartIndex;
			if (atIndex === -1) return; // Exit if there's no '@' symbol

			// Step 3: Rebuild HTML to match content before and after '@'
			let charCount = 0;
			const rebuildHTML = (element: ChildNode, isBefore: boolean): string => {
				if (element.nodeType === Node.TEXT_NODE) {
					const text = element.textContent || '';
					const endCount = charCount + text.length;
					let newText = '';

					// For text nodes, only include relevant parts based on `isBefore`
					if (isBefore && endCount <= atIndex) {
						newText = text; // Keep entire text node if entirely before '@'
					} else if (!isBefore && charCount >= atIndex + 1) {
						newText = text; // Keep entire text node if entirely after '@'
					} else if (isBefore && endCount > atIndex) {
						newText = text.slice(0, atIndex - charCount); // Only take part before '@'
					} else if (!isBefore && charCount < atIndex + 1) {
						newText = text.slice(atIndex - charCount).replace(/^@\S*/, '') // Only take part after '@'
					}

					charCount += text.length;
					return newText;
				} else if (element.nodeType === Node.ELEMENT_NODE) {

					const htmlElement = element as HTMLElement;

					// Rebuild attributes as a string
					const attributes = Array.from(htmlElement.attributes)
						.map((attr) => `${attr.name}="${attr.value}"`)
						.join(' ');

					// For elements (like <span>, <b>, etc.), recursively rebuild child nodes
					const elementHTML = Array.from(element.childNodes)
						.map((child) => rebuildHTML(child, isBefore))
						.join('');
					// charCount += element.textContent?.length || 0;


					// Wrap with tags if content exists within this element after slicing
					if (elementHTML) {
						const tagName = (element as HTMLElement).tagName.toLowerCase();
						return `<${tagName}${attributes ? ' ' + attributes : ''}>${elementHTML}</${tagName}>`;
					}
				}
				return '';
			};

			const beforeHTML = Array.from(tempDiv.childNodes)
				.map((node) => rebuildHTML(node, true))
				.join('');
			charCount = 0;
			const afterHTML = Array.from(tempDiv.childNodes)
				.map((node) => rebuildHTML(node, false))
				.join('');

			// Output the HTML content before and after '@'
			console.log('Before @:', beforeHTML);
			console.log('After @:', afterHTML);

			// Insert mention with a colored span
			const newContent = `${beforeHTML}<span contentEditable='false' style="color: ${entityTypeColors[entity.type]
				}" >@${entity.name}</span> ${afterHTML}`;
			editableRef.current.innerHTML = newContent;

			// Update the plain text state
			setText(editableRef.current.innerHTML || '');
			setSuggestions([]);
			setMentionStartIndex(null);
		}
	};

	// Function to detect "@" key to start mentioning
	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const selection = window.getSelection();

		if (e.key === '@') {
			let offset = 0;
			// Ensure the contentEditableRef and its current property are defined
			// if (!editableRef.current) return 0;
			const childNodes = Array.from(editableRef.current!.childNodes);

			for (const node of childNodes) {
				if (node === selection?.focusNode) {
					// If we are at the focus node, add the focusOffset and stop
					offset += selection?.focusOffset;
					break;
				} else if (node.nodeType === Node.TEXT_NODE) {
					// If the node is a text node, add its length
					offset += node.textContent?.length ?? 0;
				} else if (node.nodeType === Node.ELEMENT_NODE) {
					// If the node is an element (like a <span>), include its length
					offset += node.textContent?.length ?? 0;
				}
			}
			console.log('Offset after including span:', offset);
			setMentionStartIndex(offset ?? null);
		}

	};

	return (
		<div style={{ position: 'relative', width: '100%' }}>
			{/* Suggestions dropdown */}
			{suggestions.length > 0 && (
				<ul
					style={{
						listStyle: 'none',
						padding: '0',
						margin: '5px 0',
						border: '1px solid #ddd',
						borderRadius: '5px',
						maxWidth: '300px',
						backgroundColor: '#f9f9f9',
						position: 'absolute',
						zIndex: 10,
						top: popupPosition.top, left: popupPosition.left
					}}
				>
					{suggestions.map((entity) => (
						<li
							key={entity.id}
							onClick={() => selectMention(entity)}
							style={{
								padding: '5px 10px',
								cursor: 'pointer',
								color: entityTypeColors[entity.type],
							}}
						>
							{entity.name}{' '}
							<span style={{ fontSize: '0.8em', color: '#666' }}>
								({entity.type})
							</span>
						</li>
					))}
				</ul>
			)}

			{/* Main contenteditable div for styled input */}
			<div
				contentEditable
				ref={editableRef}
				onInput={handleInput}
				onKeyDown={handleKeyDown}
				style={{
					width: '100%',
					padding: '10px',
					minHeight: '100px',
					borderRadius: '5px',
					border: '1px solid #ddd',
					whiteSpace: 'pre-wrap',
					wordWrap: 'break-word',
					outline: 'none',
					textAlign: 'left'
				}}
			/>
		</div>
	);
}
