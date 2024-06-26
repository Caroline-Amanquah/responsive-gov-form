import globals from "globals";
import pluginJs from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import jestPlugin from "eslint-plugin-jest";
import jestFormattingPlugin from "eslint-plugin-jest-formatting";
import nPlugin from "eslint-plugin-n";
import promisePlugin from "eslint-plugin-promise";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  { 
    files: ["**/*.js"], 
    languageOptions: { 
      sourceType: "commonjs",
      globals: {
        ...globals.browser,
        process: "readonly",
        __dirname: "readonly"
      }
    },
    plugins: {
      import: importPlugin,
      jest: jestPlugin,
      'jest-formatting': jestFormattingPlugin,
      n: nPlugin,
      promise: promisePlugin,
      prettier: prettierPlugin
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'off', // Allow console in development

      // Check for mandatory file extensions
      // https://nodejs.org/api/esm.html#mandatory-file-extensions
      'import/extensions': ['error', 'ignorePackages'],
      
      'import/default': 'off',
      'import/namespace': 'off',
      'n/no-extraneous-require': 'off',
      'n/no-extraneous-import': 'off',
      'n/no-missing-require': 'off',
      'n/no-missing-import': 'off',
      'no-useless-escape': 'error',
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: true
      }
    },
  },
  pluginJs.configs.recommended,
  {
    ignores: ['.server', '.public', 'src/__fixtures__', 'coverage']
  }
];
