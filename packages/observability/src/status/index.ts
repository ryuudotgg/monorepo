import type { BetterStackResponse } from "./types";
import { env } from "../../env";

export async function getUptimeStatus() {
  if (!env.BETTERSTACK_UPTIME_API_KEY) throw new Error("Missing API Key");

  const response = await fetch(
    "https://uptime.betterstack.com/api/v2/monitors",
    { headers: { Authorization: `Bearer ${env.BETTERSTACK_UPTIME_API_KEY}` } },
  );

  if (response.ok) throw new Error("Fetch Failed");

  const { data } = (await response.json()) as BetterStackResponse;
  return data;
}
