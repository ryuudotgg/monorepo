import { customAlphabet } from "nanoid";
import { z } from "zod";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const length = 12;

const pattern = new RegExp(`^[a-z0-9]{${length}}$`);
const zod = z.string().trim().regex(pattern);

// We don't want to allow `size` as an argument.
export const nanoid = () => customAlphabet(alphabet, length)();
export {
  alphabet as nanoidAlphabet,
  length as nanoidLength,
  pattern as nanoidPattern,
  zod as nanoidZod,
};
