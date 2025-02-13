import type { ServerRuntime } from "next";

import { handlers } from "@ryuu/auth";

export const runtime: ServerRuntime = "edge";
export const { GET, POST } = handlers;
