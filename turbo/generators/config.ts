import { execSync } from "node:child_process";
import type { PlopTypes } from "@turbo/gen";

interface PackageJson {
  name: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("init", {
    description: "Generate a new package for the monorepo",
    prompts: [
      {
        type: "input",
        name: "name",
        message:
          "What is the name of the package? (You can skip the `@purr/` prefix)",
      },
      {
        type: "input",
        name: "deps",
        message:
          "Any dependencies you would like to install? (A space separated list, you can append `@dev`)",
      },
    ],
    actions: [
      (answers) => {
        if ("name" in answers && typeof answers.name === "string")
          if (answers.name.startsWith("@purr/"))
            answers.name = answers.name.replace("@purr/", "");

        return "Sanitized";
      },
      {
        type: "add",
        path: "packages/{{ name }}/eslint.config.js",
        templateFile: "templates/eslint.config.js.hbs",
      },
      {
        type: "add",
        path: "packages/{{ name }}/package.json",
        templateFile: "templates/package.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{ name }}/tsconfig.json",
        templateFile: "templates/tsconfig.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{ name }}/src/index.ts",
        template: "export const name = '{{ name }}';",
      },
      {
        type: "modify",
        path: "packages/{{ name }}/package.json",
        async transform(content, answers) {
          if ("deps" in answers && typeof answers.deps === "string") {
            const pkg = JSON.parse(content) as PackageJson;

            for (const dep of answers.deps.split(" ").filter(Boolean).sort()) {
              const isDev = dep.endsWith("@dev");
              const name = isDev ? dep.slice(0, -4) : dep;

              const version = await fetch(
                `https://registry.npmjs.org/-/package/${name}/dist-tags`,
              )
                .then((res) => res.json())
                .then((json) => json.latest);

              if (isDev) {
                if (!pkg.devDependencies) pkg.devDependencies = {};
                pkg.devDependencies[dep] = `^${version}`;
              } else {
                if (!pkg.dependencies) pkg.dependencies = {};
                pkg.dependencies[dep] = `^${version}`;
              }
            }

            return JSON.stringify(pkg, null, 2);
          }

          return content;
        },
      },
      async (answers) => {
        if ("name" in answers && typeof answers.name === "string") {
          execSync("pnpm install", { stdio: "inherit" });
          execSync(
            `pnpm prettier --write packages/${answers.name}/** --list-different`,
          );

          return "Scaffolded";
        }

        return "Failed";
      },
    ],
  });
}
