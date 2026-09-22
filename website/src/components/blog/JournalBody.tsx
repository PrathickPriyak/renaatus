import type { ReactNode } from "react";
import type { JournalBlock, JournalDoc, TextNode } from "@/lib/admin/journal-body";
import { safeHref } from "@/lib/admin/journal-body";
import { Text } from "@/design-system/components/text";

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

function InlineText({ nodes }: { nodes?: TextNode[] }) {
  if (!nodes || nodes.length === 0) {
    return null;
  }

  return (
    <>
      {nodes.map((node, index) => {
        const link = node.marks?.find((mark) => mark.type === "link");
        const bold = node.marks?.some((mark) => mark.type === "bold");
        let content: ReactNode = node.text;
        if (bold) {
          content = <strong>{content}</strong>;
        }
        if (link && link.type === "link") {
          const href = safeHref(link.attrs.href);
          if (!href) {
            return <span key={`${node.text}-${index}`}>{content}</span>;
          }
          return (
            <a
              key={`${href}-${index}`}
              href={href}
              className="text-brass underline decoration-brass/40 underline-offset-4 transition-colors hover:decoration-brass"
              {...(isExternalHref(href)
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {content}
            </a>
          );
        }
        return <span key={`${node.text}-${index}`}>{content}</span>;
      })}
    </>
  );
}

function Block({ block }: { block: JournalBlock }) {
  if (block.type === "heading") {
    const className = "font-display text-cream mt-10 first:mt-0";
    const children = <InlineText nodes={block.content} />;
    if (block.attrs.level === 1) {
      return <h2 className={`${className} text-h2`}>{children}</h2>;
    }
    if (block.attrs.level === 2) {
      return <h3 className={`${className} text-h3`}>{children}</h3>;
    }
    return <h4 className={`${className} text-xl`}>{children}</h4>;
  }

  if (block.type === "bulletList") {
    return (
      <ul className="mt-5 list-disc space-y-2 pl-5 text-body text-cream-muted first:mt-0">
        {block.content.map((item, itemIndex) => (
          <li key={itemIndex}>
            <InlineText nodes={item.content[0]?.content} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Text className="mt-5 first:mt-0">
      <InlineText nodes={block.content} />
    </Text>
  );
}

export function JournalBody({ doc }: { doc: JournalDoc }) {
  return (
    <div className="max-w-prose">
      {doc.content.map((block, index) => (
        <Block key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}
