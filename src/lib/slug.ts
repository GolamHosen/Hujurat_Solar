export function slugify(input: string): string {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-.]/g, "")
    .replace(/\./g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function projectSlug(params: {
  systemSizeKw?: string | number | null;
  title: string;
  suburb: string;
}): string {
  const { systemSizeKw, title, suburb } = params;
  if (systemSizeKw) {
    return slugify(`${systemSizeKw}kw-${title}-${suburb}`);
  }
  return slugify(`${title}-${suburb}`);
}
