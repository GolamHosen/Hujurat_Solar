type JsonLdItem = Record<string, unknown> | null | undefined;

type JsonLdProps = {
  data: JsonLdItem | JsonLdItem[];
};

/**
 * Serialises structured data for a `<script type="application/ld+json">` block.
 *
 * `JSON.stringify` on its own is not safe here: a CMS-authored title containing
 * `</script>` would close the tag and let the injected markup through
 * `dangerouslySetInnerHTML` (stored XSS). Escaping these characters to their
 * JSON `\uXXXX` form keeps the data identical when parsed while making it
 * impossible to terminate the script element.
 */
function serialiseJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export default function JsonLd({ data }: JsonLdProps) {
  const rawItems = Array.isArray(data) ? data : [data];
  const items = rawItems.filter((item): item is Record<string, unknown> => item !== null && item !== undefined && typeof item === "object");

  if (items.length === 0) return null;

  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialiseJsonLd(item) }}
        />
      ))}
    </>
  );
}

