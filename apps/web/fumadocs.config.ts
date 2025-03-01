import { fileGenerator, remarkDocGen, remarkInstall } from "fumadocs-docgen";
import { remarkTypeScriptToJavaScript } from "fumadocs-docgen/remark-ts2js";
import { defineConfig, defineDocs, metaSchema } from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineDocs({
  dir: "src/content/docs",
  docs: { async: true },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
});

export default defineConfig({
  lastModifiedTime: "git",

  async mdxOptions() {
    return {
      rehypeCodeOptions: {
        lazy: true,
        experimentalJSEngine: true,
        langs: ["html", "js", "ts", "tsx", "mdx"],
        inline: "tailing-curly-colon",
        themes: {
          light: "vitesse-light",
          dark: "vitesse-black",
        },
      },

      remarkPlugins: [
        [remarkInstall, { persist: { id: "package-manager" } }],
        [remarkDocGen, { generators: [fileGenerator()] }],
        remarkTypeScriptToJavaScript,
      ],
    };
  },
});
