export function removeTrailingSlash(url: URL | string) {
  if (typeof url === "string") return url.replace(/\/$/, "");
  return String(url).replace(/\/$/, "");
}
