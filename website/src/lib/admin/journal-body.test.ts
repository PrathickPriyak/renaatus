import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { journalBodyToText, parseJournalBody } from "@/lib/admin/journal-body";

describe("journal body", () => {
  it("parses headings, paragraphs, lists, and links", () => {
    const doc = parseJournalBody(
      [
        "# Landmark",
        "",
        "Renaatus is proud to partner with [CMRL](https://chennaimetrorail.org).",
        "",
        "- 119-metre tower",
        "- Civic ground",
      ].join("\n"),
    );

    assert.equal(doc.type, "doc");
    assert.equal(doc.content[0]?.type, "heading");
    assert.equal(doc.content[1]?.type, "paragraph");
    assert.equal(doc.content[2]?.type, "bulletList");
  });

  it("round-trips structured body back to editable text", () => {
    const source =
      "## Operations\n\nA new era of operational excellence.\n\n- Streamlined operations\n- Data-driven decisions";
    const text = journalBodyToText(parseJournalBody(source));
    assert.match(text, /## Operations/);
    assert.match(text, /A new era of operational excellence\./);
    assert.match(text, /- Streamlined operations/);
  });

  it("drops javascript hrefs from links", () => {
    const doc = parseJournalBody("See [bad](javascript:alert(1)) now.");
    const paragraph = doc.content[0];
    assert.equal(paragraph?.type, "paragraph");
    const json = JSON.stringify(doc);
    assert.equal(json.includes("javascript:"), false);
  });
});
