/** Renders one or more schema.org objects as a JSON-LD script tag. */
export function JsonLd({ data }: { data: object | readonly object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: data is static and server-authored;
      // `<` is escaped so a value can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
