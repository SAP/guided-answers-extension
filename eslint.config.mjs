import { defineConfig, globalIgnores } from 'eslint/config';
import promise from 'eslint-plugin-promise';
import jsdoc from 'eslint-plugin-jsdoc';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import _import from 'eslint-plugin-import';
import sonarjs from 'eslint-plugin-sonarjs';
import react from 'eslint-plugin-react';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const packageTsConfigs = ['core', 'ide-extension', 'types', 'webapp'].map(
    (pkg) => path.join(rootDir, 'packages', pkg, 'tsconfig.json')
);
const allTsConfigs = [...packageTsConfigs, path.join(rootDir, 'tsconfig.json')];

export default defineConfig([
    globalIgnores(['**/dist/**', '**/test/**', '**/node_modules/**']),

    // Base config for all files
    {
        plugins: {
            promise,
            jsdoc,
            '@typescript-eslint': typescriptEslint,
            import: fixupPluginRules(_import)
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2021
            }
        },

        settings: {
            jsdoc: {
                tagNamePreference: {
                    augments: {
                        message:
                            '@extends is to be used over @augments as it is more evocative of classes than @augments',
                        replacement: 'extends'
                    }
                }
            },

            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: allTsConfigs
                }
            }
        },

        rules: {
            'comma-dangle': ['error', 'never'],
            'jsdoc/require-param': 'error',
            'jsdoc/require-param-description': 'warn',
            'jsdoc/require-param-name': 'error',
            'jsdoc/require-returns': 'error',
            'jsdoc/require-returns-check': 'error',
            'jsdoc/require-returns-description': 'warn',
            'jsdoc/require-returns-type': 'error',

            'jsdoc/require-jsdoc': [
                'warn',
                {
                    require: {
                        ClassDeclaration: true,
                        MethodDefinition: true
                    },
                    exemptEmptyFunctions: true
                }
            ],

            'jsdoc/valid-types': 'error',
            'jsdoc/check-types': 'error',
            'jsdoc/check-param-names': 'error',

            'jsdoc/check-tag-names': [
                'error',
                {
                    definedTags: ['ui5-restricted', 'experimental', 'final']
                }
            ],

            'jsdoc/match-description': 'error',
            'promise/always-return': 'off',
            'promise/no-return-wrap': 'off',
            'promise/param-names': 'error',

            'promise/catch-or-return': [
                'error',
                {
                    allowThen: true
                }
            ],

            'promise/no-native': 'off',
            'promise/no-nesting': 'error',
            'promise/no-promise-in-callback': 'error',
            'promise/no-callback-in-promise': 'error',
            'promise/avoid-new': 'off',
            'promise/no-new-statics': 'error',
            'promise/no-return-in-finally': 'error',
            'promise/valid-params': 'error',
            'default-param-last': 'error',
            'no-cond-assign': 'error',
            'no-constant-condition': 'error',
            'no-control-regex': 'error',
            'no-debugger': 'error',
            'no-dupe-args': 'error',
            'no-dupe-keys': 'error',
            'no-duplicate-case': 'error',
            'no-empty-character-class': 'error',
            'no-empty': 'error',
            'no-ex-assign': 'error',
            'no-extra-boolean-cast': 'error',
            'no-extra-parens': ['error', 'functions'],
            'no-extra-semi': 'error',
            'no-func-assign': 'error',
            'no-inner-declarations': ['error', 'functions'],
            'no-invalid-regexp': 'error',
            'no-irregular-whitespace': 'error',
            'no-obj-calls': 'error',
            'no-regex-spaces': 'error',
            'no-sparse-arrays': 'error',
            'no-unreachable': 'error',
            'use-isnan': 'error',
            'valid-typeof': 'error',
            'accessor-pairs': 'error',
            'block-scoped-var': 'error',
            'consistent-return': 'error',
            curly: ['error', 'all'],
            'default-case': 'error',
            'no-alert': 'error',
            'no-caller': 'error',
            'no-div-regex': 'error',
            'no-eval': 'error',
            'no-extend-native': 'error',
            'no-extra-bind': 'error',
            'no-fallthrough': 'error',
            'no-floating-decimal': 'error',
            'no-implied-eval': 'error',
            'no-iterator': 'error',
            'no-labels': 'error',
            'no-lone-blocks': 'error',
            'no-loop-func': 'error',
            'no-new-func': 'error',
            'no-new-wrappers': 'error',
            'no-new': 'error',
            'no-octal-escape': 'error',
            'no-octal': 'error',
            'no-proto': 'error',
            'no-redeclare': 'error',
            'no-return-assign': 'error',
            'no-script-url': 'error',
            'no-self-compare': 'error',
            'no-sequences': 'error',
            'no-unused-expressions': 'error',
            'no-void': 'error',
            'no-warning-comments': 'error',
            'no-with': 'error',
            radix: 'error',
            'wrap-iife': ['error', 'any'],
            yoda: 'error',
            strict: ['error', 'function'],
            'no-delete-var': 'error',
            'no-label-var': 'error',
            'no-shadow-restricted-names': 'error',
            'no-undef-init': 'error',
            'no-undef': 'error',

            'no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    args: 'none'
                }
            ],

            'no-use-before-define': 'off',
            camelcase: 'error',
            'consistent-this': ['error', 'that'],
            'max-nested-callbacks': ['error', 3],
            'new-cap': 'error',
            'new-parens': 'error',
            'no-array-constructor': 'error',
            'no-lonely-if': 'error',
            'no-nested-ternary': 'error',
            'no-new-object': 'error',

            'quote-props': [
                'error',
                'as-needed',
                {
                    keywords: true,
                    unnecessary: false
                }
            ],

            'semi-spacing': [
                'error',
                {
                    before: false,
                    after: true
                }
            ],

            semi: 'error',

            'keyword-spacing': [
                'error',
                {
                    after: true
                }
            ],

            'space-before-function-paren': [
                'error',
                {
                    anonymous: 'never',
                    named: 'never',
                    asyncArrow: 'always'
                }
            ],

            'space-infix-ops': 'error',

            'space-unary-ops': [
                'error',
                {
                    words: true,
                    nonwords: false
                }
            ],

            'import/no-unresolved': 'error',

            'import/no-extraneous-dependencies': [
                'error',
                {
                    devDependencies: true,
                    optionalDependencies: true,
                    peerDependencies: true,
                    bundledDependencies: false
                }
            ]
        }
    },

    // Prettier — disable conflicting rules and enable prettier errors
    prettierConfig,
    {
        plugins: { prettier: prettierPlugin },
        rules: {
            'prettier/prettier': ['error', { endOfLine: 'auto' }]
        }
    },

    // SonarJS recommended
    sonarjs.configs.recommended,

    // TypeScript files
    {
        files: ['**/*.ts', '**/*.tsx'],

        extends: [typescriptEslint.configs['flat/recommended']],

        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: allTsConfigs
            }
        },

        settings: {
            jsdoc: {
                mode: 'typescript'
            }
        },

        rules: {
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-redundant-type-constituents': 'error',
            '@typescript-eslint/no-unused-vars': ['error'],
            '@typescript-eslint/no-floating-promises': ['error'],
            '@typescript-eslint/prefer-nullish-coalescing': ['error'],
            '@typescript-eslint/prefer-regexp-exec': ['error'],

            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                    disallowTypeAnnotations: true
                }
            ],

            '@typescript-eslint/no-use-before-define': ['error', 'nofunc'],
            '@typescript-eslint/prefer-optional-chain': ['error'],
            'jsdoc/require-param-type': 'off',
            'jsdoc/require-returns-type': 'off',

            'jsdoc/tag-lines': [
                'error',
                'never',
                {
                    startLines: 1
                }
            ],

            'prefer-const': [
                'error',
                {
                    destructuring: 'all'
                }
            ],

            'sonarjs/cognitive-complexity': 'error'
        }
    },

    // Webapp — React-specific
    {
        files: ['packages/webapp/**/*.ts', 'packages/webapp/**/*.tsx'],

        plugins: {
            react: fixupPluginRules(react)
        },

        extends: [{ rules: react.configs.flat.recommended.rules }],

        languageOptions: {
            globals: {
                ...globals.browser,
                NodeJS: true
            },
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: path.join(rootDir, 'packages/webapp/tsconfig.json')
            }
        },

        settings: {
            react: {
                createClass: 'createReactClass',
                pragma: 'React',
                fragment: 'Fragment',
                version: 'detect'
            }
        },

        rules: {
            'jsdoc/require-param-type': 'off',
            'jsdoc/require-returns-type': 'off',
            'react/prefer-read-only-props': 'error',
            'react/hook-use-state': ['error', { allowDestructuredState: true }]
        }
    },

    // Test files — relaxed rules
    {
        files: ['packages/*/test/**/*.js', 'packages/*/test/**/*.ts'],

        languageOptions: {
            parser: tsParser
        },

        rules: {
            'jsdoc/require-param': 'off',
            'jsdoc/require-param-description': 'off',
            'jsdoc/require-param-name': 'off',
            'jsdoc/require-param-type': 'off',
            'jsdoc/require-returns': 'off',
            'jsdoc/require-returns-check': 'off',
            'jsdoc/require-returns-description': 'off',
            'jsdoc/require-returns-type': 'off',

            'jsdoc/require-jsdoc': [
                'off',
                {
                    require: {
                        ClassDeclaration: true,
                        MethodDefinition: true
                    },
                    exemptEmptyFunctions: true
                }
            ],

            'jsdoc/valid-types': 'off',
            'jsdoc/check-types': 'off',
            'jsdoc/check-tag-names': 'off',
            'jsdoc/match-description': 'off',
            'promise/param-names': 'off',
            'sonarjs/cognitive-complexity': ['error', 15],
            '@typescript-eslint/no-unused-vars': 'off',

            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                    disallowTypeAnnotations: true
                }
            ],

            '@typescript-eslint/no-use-before-define': ['error', 'nofunc']
        }
    }
]);
