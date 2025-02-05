import type { InferMetaType, InferPageType } from "fumadocs-core/source";
import { createElement } from "react";
import { loader } from "fumadocs-core/source";
import { icons } from "lucide-react";

import { docs } from "../../.source";

const source = loader({
  baseUrl: "/docs",

  icon(icon) {
    if (icon && icon in icons)
      return createElement(icons[icon as keyof typeof icons]);
  },

  source: docs.toFumadocsSource(),
});

type Page = InferPageType<typeof source>;
type Meta = InferMetaType<typeof source>;

export { source, type Meta, type Page };
