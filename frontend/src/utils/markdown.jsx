import React from "react";

/**
 * Parses inline formatting: **bold** and `code` tags.
 */
function parseInline(text) {
  const parts = [];
  let index = 0;
  
  // Regex to find bold **text** or inline code `text`
  const regex = /(\*\*|`)(.*?)\1/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    const type = match[1];
    const matchText = match[2];
    
    // Add preceding text
    if (matchIndex > index) {
      parts.push(text.substring(index, matchIndex));
    }
    
    // Add formatted tag
    if (type === "**") {
      parts.push(<strong key={matchIndex} className="font-bold text-white">{matchText}</strong>);
    } else if (type === "`") {
      parts.push(<code key={matchIndex} className="bg-white/10 text-blue-300 px-1 py-0.5 rounded font-mono text-xs">{matchText}</code>);
    }
    
    index = regex.lastIndex;
  }
  
  if (index < text.length) {
    parts.push(text.substring(index));
  }
  
  return parts.length > 0 ? parts : text;
}

/**
 * Custom renderer to convert markdown lines into React components.
 */
export function renderMarkdown(text) {
  if (!text) return null;
  
  const lines = text.split("\n");
  let inList = false;
  
  return lines.map((line, idx) => {
    let content = line;
    
    // Check for headers
    if (content.startsWith("### ")) {
      return <h4 key={idx} className="text-sm font-bold text-white mt-4 mb-2">{parseInline(content.substring(4))}</h4>;
    } else if (content.startsWith("## ")) {
      return <h3 key={idx} className="text-base font-bold text-white mt-4 mb-2">{parseInline(content.substring(3))}</h3>;
    } else if (content.startsWith("# ")) {
      return <h2 key={idx} className="text-lg font-bold text-white mt-4 mb-2">{parseInline(content.substring(2))}</h2>;
    }
    
    // Check for bullet lists
    if (content.trim().startsWith("* ") || content.trim().startsWith("- ")) {
      // Find where list content starts
      const bulletContent = content.trim().substring(2);
      return (
        <li key={idx} className="list-disc list-inside ml-4 my-1 text-gray-300">
          {parseInline(bulletContent)}
        </li>
      );
    }
    
    // Check for numbered lists
    const numMatch = content.trim().match(/^(\d+)\.\s(.*)/);
    if (numMatch) {
      return (
        <li key={idx} className="list-decimal list-inside ml-4 my-1 text-gray-300">
          {parseInline(numMatch[2])}
        </li>
      );
    }
    
    // Empty line
    if (!content.trim()) {
      return <div key={idx} className="h-2" />;
    }
    
    // Regular paragraph
    return <p key={idx} className="my-1.5 text-gray-300 leading-relaxed">{parseInline(content)}</p>;
  });
}
