module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 12,
  },
  extends: ['airbnb-base', 'plugin:yml/standard'],
  overrides: [
    {
      files: ['*.yaml', '*.yml'],
      parser: 'yaml-eslint-parser',
    },
  ],
  rules: {
    'no-console': 'off',
    'consistent-return': 'off',
    'no-unused-expressions': 'off',
  },
};
