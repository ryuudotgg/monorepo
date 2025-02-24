import type { Editor } from "@tiptap/react";

import type { TiptapProps } from "./tiptap";

interface ShortcutKeyResult {
  symbol: string;
  readable: string;
}

export interface FileError {
  file: File | string;
  reason: "type" | "size" | "invalidBase64" | "base64NotAllowed";
}

export interface FileValidationOptions {
  allowedMimeTypes: string[];
  maxFileSize?: number;
  allowBase64: boolean;
}

type FileInput = File | { src: string | File; alt?: string; title?: string };

export const isClient = (): boolean => typeof window !== "undefined";
export const isServer = (): boolean => !isClient();
export const isMacOS = (): boolean =>
  isClient() && window.navigator.platform === "MacIntel";

const shortcutKeyMap: Record<string, ShortcutKeyResult> = {
  mod: isMacOS()
    ? { symbol: "⌘", readable: "Command" }
    : { symbol: "Ctrl", readable: "Control" },

  alt: isMacOS()
    ? { symbol: "⌥", readable: "Option" }
    : { symbol: "Alt", readable: "Alt" },

  shift: { symbol: "⇧", readable: "Shift" },
};

export function getShortcutKey(key: string): ShortcutKeyResult {
  return shortcutKeyMap[key.toLowerCase()] ?? { symbol: key, readable: key };
}

export function getShortcutKeys(keys: string[]): ShortcutKeyResult[] {
  return keys.map(getShortcutKey);
}

export function getOutput(
  editor: Editor,
  format: TiptapProps["output"],
): object | string {
  switch (format) {
    case "json":
      return editor.getJSON();

    case "html":
      return editor.isEmpty ? "" : editor.getHTML();

    default:
      return editor.getText();
  }
}

export function isUrl(
  text: string,
  options: { requireHostname: boolean; allowBase64?: boolean } = {
    requireHostname: false,
  },
): boolean {
  if (text.includes("\n")) return false;

  try {
    const url = new URL(text);
    const blockedProtocols = [
      "javascript:",
      "file:",
      "vbscript:",
      ...(options.allowBase64 ? [] : ["data:"]),
    ];

    if (blockedProtocols.includes(url.protocol)) return false;
    if (options.allowBase64 && url.protocol === "data:")
      return /^data:image\/[a-z]+;base64,/.test(text);

    if (url.hostname) return true;

    return (
      url.protocol !== "" &&
      (url.pathname.startsWith("//") || url.pathname.startsWith("http")) &&
      !options.requireHostname
    );
  } catch {
    return false;
  }
}

export function sanitizeUrl(
  url: string | null | undefined,
  options: { allowBase64?: boolean } = {},
): string | undefined {
  if (!url) return undefined;

  if (options.allowBase64 && url.startsWith("data:image"))
    return isUrl(url, { requireHostname: false, allowBase64: true })
      ? url
      : undefined;

  return isUrl(url, {
    requireHostname: false,
    allowBase64: options.allowBase64,
  }) || /^(\/|#|mailto:|sms:|fax:|tel:)/.test(url)
    ? url
    : `https://${url}`;
}

export async function blobUrlToBase64(blobUrl: string): Promise<string> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Failed to convert Blob to base64"));
    };

    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function randomId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Failed to convert File to base64"));
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function validateFileOrBase64<T extends FileInput>(
  input: File | string,
  options: FileValidationOptions,
  originalFile: T,
  validFiles: T[],
  errors: FileError[],
): void {
  const { isValidType, isValidSize } = checkTypeAndSize(input, options);

  if (isValidType && isValidSize) validFiles.push(originalFile);
  else {
    if (!isValidType) errors.push({ file: input, reason: "type" });
    if (!isValidSize) errors.push({ file: input, reason: "size" });
  }
}

function checkTypeAndSize(
  input: File | string,
  { allowedMimeTypes, maxFileSize }: FileValidationOptions,
): { isValidType: boolean; isValidSize: boolean } {
  const mimeType = input instanceof File ? input.type : base64MimeType(input);
  const size =
    input instanceof File ? input.size : atob(input.split(",")[1] ?? "").length;

  const isValidType =
    allowedMimeTypes.length === 0 ||
    allowedMimeTypes.includes(mimeType) ||
    allowedMimeTypes.includes(`${mimeType.split("/")[0]}/*`);

  const isValidSize = !maxFileSize || size <= maxFileSize;

  return { isValidType, isValidSize };
}

function base64MimeType(encoded: string): string {
  const pattern = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+)(?:[^]*)/;
  const result = pattern.exec(encoded);

  return result?.[1] ?? "unknown";
}

function isBase64(str: string): boolean {
  if (str.startsWith("data:")) {
    const matches = /^data:[^;]+;base64,(.+)$/.exec(str);

    if (matches?.[1]) str = matches[1];
    else return false;
  }

  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
}

export function filterFiles<T extends FileInput>(
  files: T[],
  options: FileValidationOptions,
): [T[], FileError[]] {
  const validFiles: T[] = [];
  const errors: FileError[] = [];

  for (const file of files) {
    const actualFile = "src" in file ? file.src : file;

    if (
      actualFile instanceof File ||
      (typeof actualFile === "string" && isBase64(actualFile))
    ) {
      if (typeof actualFile === "string" && !options.allowBase64) {
        errors.push({ file: actualFile, reason: "base64NotAllowed" });
        continue;
      }

      validateFileOrBase64(actualFile, options, file, validFiles, errors);

      continue;
    }

    if (typeof actualFile === "string")
      if (sanitizeUrl(actualFile, { allowBase64: options.allowBase64 }))
        validFiles.push(file);
      else errors.push({ file: actualFile, reason: "invalidBase64" });
  }

  return [validFiles, errors];
}
