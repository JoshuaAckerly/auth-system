import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
    js.configs.recommended,
    {
        ...react.configs.flat.recommended,
        ...react.configs.flat['jsx-runtime'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/no-unescaped-entities': 'off',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        plugins: {
            'react-hooks': reactHooks,
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },
    // Node.js / config files
    {
        files: ['**/*.{js,mjs,cjs}', 'vite.config.js'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    // Test files
    {
        files: ['**/__tests__/**/*', '**/*.test.{js,jsx}'],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
        rules: {
            'no-unused-vars': 'off',
        },
    },
    prettier,
    {
        ignores: ['vendor/', 'node_modules/', 'public/build/', 'storage/'],
    },
];
