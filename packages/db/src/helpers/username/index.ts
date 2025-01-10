import { varchar } from "drizzle-orm/mysql-core";
import { z } from "zod";

import { adjectives } from "./adjectives";
import { nouns } from "./nouns";

const length = 15;

const pattern = new RegExp(`^[a-z][a-z0-9]{0,${length - 1}}$`);
const zod = z.string().trim().regex(pattern);

const getRandomInt = (min = 0, max = 4294967295) =>
  (Math.random() * ((max | 0) - (min | 0) + 1.0) + (min | 0)) | 0;

function generate() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  if (!adjective) return generate();

  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  if (!noun) return generate();

  const username =
    adjective + noun + String(Math.floor(getRandomInt(100, 999)));

  return username.substring(0, length);
}

const username = (name?: string) =>
  name
    ? varchar(name, { length }).$defaultFn(generate)
    : varchar({ length }).$defaultFn(generate);

export {
  username,
  generate as usernameGenerate,
  pattern as usernamePattern,
  zod as usernameZod,
};
