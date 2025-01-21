import { basehub as basehubClient } from "basehub";

import { env } from "../env";

const basehub = basehubClient({
  token: env.BASEHUB_TOKEN,
});

export { basehub };
