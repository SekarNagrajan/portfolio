import { describe, expect, it } from "vitest";
import { escapeHtml } from "./contact";

describe("escapeHtml", () => {
  it("escapes characters that would break the email body", () => {
    expect(escapeHtml(`<script>alert("x")</script> & 'y'`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;",
    );
  });
});
