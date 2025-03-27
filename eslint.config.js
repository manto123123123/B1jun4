// CommonJS 방식
const eslintPluginPrettier = require('eslint-plugin-prettier')

/** @type {import("eslint").ESLint.ConfigData} */
module.exports = [
  {
    ignores: ['node_modules', 'dist'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'warn',
      eqeqeq: 'error',
    },
  },
]
