export function resolveImageSrc(
  value?: string | null,
  base = (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001"
  ).replace(/\/+$/, "") + "/",
) {
  if (!value || typeof value !== "string") return "/placeholder.png";

  let v = value.trim();

  if (v.startsWith(base)) {
    v = v.substring(base.length);
  }
  if (/^https?:\/\//i.test(v)) {
    return v;
  }

  if (/^(data|blob)/.test(v)) return v;

  const b = base.replace(/\/+$/, "");
  const p = v.replace(/^\/+/, "");
  return `${b}/${p}`;
}
