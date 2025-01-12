import baseConfig from "@ryuu/eslint-config/base";
import reactConfig from "@ryuu/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [{ ignores: ["dist/**"] }, ...baseConfig, ...reactConfig];
