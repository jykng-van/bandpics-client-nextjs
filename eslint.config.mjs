import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules:{
    'no-unused-vars':'off', //turn off no-unused-vars
    '@typescript-eslint/no-unused-vars': [
      'error', // or 'warn'
      {
        argsIgnorePattern: '^_', // Ignore unused arguments starting with an underscore
        varsIgnorePattern: '^_', // Ignore unused variables starting with an underscore
      },
    ],
    }
  }
];

export default eslintConfig;
