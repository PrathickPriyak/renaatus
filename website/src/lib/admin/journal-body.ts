type TextNode = {
  type: "text";
  text: string;
};

type ParagraphNode = {
  type: "paragraph";
  content?: TextNode[];
};

export type JournalDoc = {
  type: "doc";
  content: ParagraphNode[];
};

export function paragraphDoc(text: string): JournalDoc {
  const paragraphs = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (paragraphs.length === 0) {
    return { type: "doc", content: [{ type: "paragraph" }] };
  }

  return {
    type: "doc",
    content: paragraphs.map((paragraph) => ({
      type: "paragraph",
      content: [{ type: "text", text: paragraph }],
    })),
  };
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
    .map((block) => {
      if (!block || typeof block !== "object" || !("content" in block)) {
        return "";
      }
      const nodes = (block as { content?: unknown }).content;
      if (!Array.isArray(nodes)) {
        return "";
      }
      return nodes
        .map((node) => {
          if (!node || typeof node !== "object" || !("text" in node)) {
            return "";
          }
          return typeof (node as { text?: unknown }).text === "string"
            ? (node as { text: string }).text
            : "";
        })
        .join("");
    })
    .filter((part) => part.length > 0)
    .join("\n\n");
}
