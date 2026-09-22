export type TextMark =
  | { type: "bold" }
  | { type: "link"; attrs: { href: string } };

export type TextNode = {
  type: "text";
  text: string;
  marks?: TextMark[];
};

export type ParagraphNode = {
  type: "paragraph";
  content?: TextNode[];
};

export type HeadingNode = {
  type: "heading";
  attrs: { level: 1 | 2 | 3 };
  content?: TextNode[];
};

export type ListItemNode = {
  type: "listItem";
  content: ParagraphNode[];
};

export type BulletListNode = {
  type: "bulletList";
  content: ListItemNode[];
};

export type JournalBlock = ParagraphNode | HeadingNode | BulletListNode;

export type JournalDoc = {
  type: "doc";
  content: JournalBlock[];
};

const EMPTY_DOC: JournalDoc = { type: "doc", content: [{ type: "paragraph" }] };

function isSafeHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("//")) {
    return false;
  }
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return true;
  }
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function safeHref(href: string): string | null {
  const trimmed = href.trim();
  return isSafeHref(trimmed) ? trimmed : null;
}

function sanitizeMarks(marks?: TextMark[]): TextMark[] | undefined {
  if (!marks) {
    return undefined;
  }
  const next: TextMark[] = [];
  for (const mark of marks) {
    if (mark.type !== "link") {
      next.push(mark);
      continue;
    }
    const href = safeHref(mark.attrs.href);
    if (href) {
      next.push({ type: "link", attrs: { href } });
    }
  }
  return next.length > 0 ? next : undefined;
}

function sanitizeTextNodes(nodes?: TextNode[]): TextNode[] | undefined {
  if (!nodes) {
    return undefined;
  }
  return nodes.map((node) => ({
    ...node,
    text: typeof node.text === "string" ? node.text : "",
    marks: sanitizeMarks(node.marks),
  }));
}

function sanitizeBlock(block: JournalBlock): JournalBlock {
  if (block.type === "bulletList") {
    return {
      type: "bulletList",
      content: (block.content ?? []).map((item) => ({
        type: "listItem",
        content: (item.content ?? []).map((paragraph) => ({
          type: "paragraph" as const,
          content: sanitizeTextNodes(paragraph.content),
        })),
      })),
    };
  }
  if (block.type === "heading") {
    return {
      type: "heading",
      attrs: { level: block.attrs?.level === 2 ? 2 : block.attrs?.level === 3 ? 3 : 1 },
      content: sanitizeTextNodes(block.content),
    };
  }
  return {
    type: "paragraph",
    content: sanitizeTextNodes(block.content),
  };
}

function sanitizeJournalDoc(doc: JournalDoc): JournalDoc {
  return {
    type: "doc",
    content: Array.isArray(doc.content) ? doc.content.map((block) => sanitizeBlock(block)) : [],
  };
}

function parseInline(text: string): TextNode[] {
  const nodes: TextNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match = pattern.exec(text);

  while (match) {
    if (match.index > lastIndex) {
      nodes.push({ type: "text", text: text.slice(lastIndex, match.index) });
    }

    const label = match[1];
    const href = match[2];
    const bold = match[3];

    if (label !== undefined && href !== undefined) {
      if (isSafeHref(href)) {
        nodes.push({
          type: "text",
          text: label,
          marks: [{ type: "link", attrs: { href } }],
        });
      } else {
        nodes.push({ type: "text", text: label });
      }
    } else if (bold !== undefined) {
      nodes.push({ type: "text", text: bold, marks: [{ type: "bold" }] });
    }

    lastIndex = match.index + match[0].length;
    match = pattern.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push({ type: "text", text: text.slice(lastIndex) });
  }

  return nodes.filter((node) => node.text.length > 0);
}

function paragraphFrom(text: string): ParagraphNode {
  const content = parseInline(text.trim());
  return content.length > 0 ? { type: "paragraph", content } : { type: "paragraph" };
}

export function parseJournalBody(text: string): JournalDoc {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const content: JournalBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const raw = lines[index] ?? "";
    const line = raw.trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1]?.length as 1 | 2 | 3;
      content.push({
        type: "heading",
        attrs: { level },
        content: parseInline(heading[2] ?? ""),
      });
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: ListItemNode[] = [];
      while (index < lines.length) {
        const itemLine = (lines[index] ?? "").trim();
        const item = /^[-*]\s+(.+)$/.exec(itemLine);
        if (!item) {
          break;
        }
        items.push({
          type: "listItem",
          content: [paragraphFrom(item[1] ?? "")],
        });
        index += 1;
      }
      content.push({ type: "bulletList", content: items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length) {
      const next = (lines[index] ?? "").trim();
      if (!next || /^(#{1,3})\s+/.test(next) || /^[-*]\s+/.test(next)) {
        break;
      }
      paragraphLines.push(next);
      index += 1;
    }
    content.push(paragraphFrom(paragraphLines.join(" ")));
  }

  return content.length > 0 ? { type: "doc", content } : EMPTY_DOC;
}

export function paragraphDoc(text: string): JournalDoc {
  return parseJournalBody(text);
}

function marksToMarkdown(node: TextNode): string {
  let value = node.text;
  if (node.marks?.some((mark) => mark.type === "bold")) {
    value = `**${value}**`;
  }
  const link = node.marks?.find((mark) => mark.type === "link");
  if (link && link.type === "link") {
    return `[${value}](${link.attrs.href})`;
  }
  return value;
}

function nodesToText(nodes: unknown): string {
  if (!Array.isArray(nodes)) {
    return "";
  }
  return nodes
    .map((node) => {
      if (!node || typeof node !== "object" || !("text" in node)) {
        return "";
      }
      const textNode = node as TextNode;
      if (typeof textNode.text !== "string") {
        return "";
      }
      return marksToMarkdown({
        type: "text",
        text: textNode.text,
        marks: Array.isArray(textNode.marks) ? textNode.marks : undefined,
      });
    })
    .join("");
}

function blockToText(block: unknown): string {
  if (!block || typeof block !== "object" || !("type" in block)) {
    return "";
  }

  const typed = block as JournalBlock;
  if (typed.type === "heading") {
    const hashes = "#".repeat(typed.attrs?.level ?? 1);
    return `${hashes} ${nodesToText(typed.content)}`.trim();
  }
  if (typed.type === "bulletList") {
    return (typed.content ?? [])
      .map((item) => {
        const paragraph = item.content?.[0];
        return `- ${nodesToText(paragraph?.content)}`.trimEnd();
      })
      .join("\n");
  }
  return nodesToText(typed.content);
}

export function journalBodyToText(body: unknown): string {
  if (typeof body === "string") {
    return body;
  }
  if (!body || typeof body !== "object" || !("content" in body)) {
    return "";
  }

  const content = (body as { content?: unknown }).content;
  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .map((block) => blockToText(block))
    .filter((part) => part.length > 0)
    .join("\n\n");
}

export function asJournalDoc(body: unknown): JournalDoc {
  if (body && typeof body === "object" && "type" in body && "content" in body) {
    const doc = body as JournalDoc;
    if (doc.type === "doc" && Array.isArray(doc.content)) {
      return sanitizeJournalDoc(doc);
    }
  }
  if (typeof body === "string") {
    return parseJournalBody(body);
  }
  return EMPTY_DOC;
}
