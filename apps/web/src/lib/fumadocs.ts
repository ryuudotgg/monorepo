import { createElement } from "react";
import { loader } from "fumadocs-core/source";
import { icons } from "lucide-react";

import { docs } from "../../.source";

export const fumadocs = loader({
  baseUrl: "/docs",

  icon(icon) {
    if (icon && icon in icons)
      return createElement(icons[icon as keyof typeof icons]);
  },

  source: docs.toFumadocsSource(),
});
