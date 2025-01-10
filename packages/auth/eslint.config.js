import baseConfig, { restrictEnvAccess } from "@purr/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [{ ignores: [] }, ...baseConfig, ...restrictEnvAccess];
