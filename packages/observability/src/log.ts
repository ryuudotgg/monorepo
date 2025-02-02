import { log as logtail } from "@logtail/next";

const log = process.env.NODE_ENV === "production" ? logtail : console;

export { log };
