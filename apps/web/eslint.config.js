import baseConfig, { restrictEnvAccess } from "@ryuu/eslint-config/base";
import nextjsConfig from "@ryuu/eslint-config/nextjs";
import reactConfig from "@ryuu/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  { ignores: [".next/**", ".source/**"] },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
