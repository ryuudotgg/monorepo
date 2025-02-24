import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

import { fonts } from "./fonts";

const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

export { cn, fonts };
