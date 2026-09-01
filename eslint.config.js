import {defineConfig} from 'eslint/config';

const eslint = require("@eslint/js");
const typescript = require("typescript-eslint");
const angular = require("angular-eslint");

export default defineConfig(
    {
        files: ["**/*.ts"],
        extends: [
            eslint.configs.recommended,
            ...typescript.configs.recommended,
            ...typescript.configs.stylistic,
            ...angular.configs.tsRecommended,
        ],
        processor: angular.processInlineTemplates,
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@angular-eslint/no-output-on-prefix": "warn",
            "@angular-eslint/prefer-standalone": "warn",
            "@angular-eslint/directive-selector": [
                "error",
                {
                    type: "attribute",
                    prefix: "st",
                    style: "camelCase",
                },
            ],
            "@angular-eslint/component-selector": [
                "error",
                {
                    type: "element",
                    prefix: "st",
                    style: "kebab-case",
                },
            ],
        },
    },
    {
        files: ["**/*.html"],
        extends: [
            ...angular.configs.templateRecommended,
            ...angular.configs.templateAccessibility,
        ],
        rules: {
            "@angular-eslint/template/click-events-have-key-events": "warn",
            "@angular-eslint/template/interactive-supports-focus": "warn"
        },
    }
);
