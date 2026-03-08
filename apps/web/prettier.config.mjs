import baseConfig from '@repo/prettier-config';

/** @type {import("prettier").Config} */
const config = {
  ...baseConfig,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
