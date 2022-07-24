module.exports = {
    env: {
        browser: true,
        node: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.eslint.json"
    },
    plugins: [
        "@angular-eslint",
        "@typescript-eslint",
        'html'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@angular-eslint/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ],
    rules: {
        'object-curly-spacing': 'error',
        'object-curly-newline': 'error',
        'curly': 'error',
        'no-extra-parens': 'error',
        'no-undef': 'off',
        '@typescript-eslint/restrict-plus-operands': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/unbound-method': 'off',
    }
};
