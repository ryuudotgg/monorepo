import { setRateLimitHeaders } from "@arcjet/decorate";
import arcjet, {
  createMiddleware,
  detectBot,
  fixedWindow,
  request,
  sensitiveInfo,
  shield,
  slidingWindow,
  tokenBucket,
  validateEmail,
} from "@arcjet/next";

import { env } from "../env";

export default arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [shield({ mode: "LIVE" })],
});

export {
  createMiddleware,
  detectBot,
  fixedWindow,
  request,
  sensitiveInfo,
  setRateLimitHeaders,
  shield,
  slidingWindow,
  tokenBucket,
  validateEmail,
};
