import type { Metadata } from "next";

export const metadata = { title: "Sign Up" } satisfies Metadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
