module.exports = {
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  extends: [
    'standard-with-typescript',
    'standard-jsx'
  ],
  rules: {
    // Disable rules from Standard that conflict with dprint
    'array-bracket-spacing': 0,
    'arrow-spacing': 0,
    'block-spacing': 0,
    'brace-style': 0,
    'comma-dangle': 0,
    'comma-spacing': 0,
    'comma-style': 0,
    'computed-property-spacing': 0,
    curly: 0,
    'dot-location': 0,
    'dot-notation': 0,
    'eol-last': 0,
    'func-call-spacing': 0,
    'generator-star-spacing': 0,
    indent: 0,
    'jsx-quotes': 0,
    'key-spacing': 0,
    'keyword-spacing': 0,
    'lines-between-class-members': 0,
    'multiline-ternary': 0,
    'new-parens': 0,
    'no-mixed-spaces-and-tabs': 0,
    'no-multi-spaces': 0,
    'no-multiple-empty-lines': 0,
    'no-tabs': 0,
    'no-trailing-spaces': 0,
    'no-whitespace-before-property': 0,
    'object-curly-newline': 0,
    'object-curly-spacing': 0,
    'object-property-newline': 0,
    'object-shorthand': 0,
    'one-var': 0,
    'operator-linebreak': 0,
    'padded-blocks': 0,
    'quote-props': 0,
    quotes: 0,
    'react/jsx-boolean-value': 0,
    'react/jsx-closing-tag-location': 0,
    'react/jsx-curly-brace-presence': 0,
    'react/jsx-curly-newline': 0,
    'react/jsx-curly-spacing': 0,
    'react/jsx-equals-spacing': 0,
    'react/jsx-first-prop-new-line': 0,
    'react/jsx-indent-props': 0,
    'react/jsx-indent': 0,
    'rest-spread-spacing': 0,
    semi: 0,
    'semi-spacing': 0,
    'space-before-blocks': 0,
    'space-before-function-paren': 0,
    'space-in-parens': 0,
    'space-infix-ops': 0,
    'space-unary-ops': 0,
    'spaced-comment': 0,
    'template-curly-spacing': 0,
    'template-tag-spacing': 0,
    'unicode-bom': 0,
    'yield-star-spacing': 0
  },
  overrides: [{
    files: ['*.ts', '*.tsx'],
    rules: {
      // Disable rules from TS Standard that conflict with dprint
      '@typescript-eslint/brace-style': 0,
      '@typescript-eslint/comma-dangle': 0,
      '@typescript-eslint/comma-spacing': 0,
      '@typescript-eslint/dot-notation': 0,
      '@typescript-eslint/func-call-spacing': 0,
      '@typescript-eslint/indent': 0,
      '@typescript-eslint/keyword-spacing': 0,
      '@typescript-eslint/lines-between-class-members': 0,
      '@typescript-eslint/member-delimiter-style': 0,
      '@typescript-eslint/object-curly-spacing': 0,
      '@typescript-eslint/quotes': 0,
      '@typescript-eslint/semi': 0,
      '@typescript-eslint/space-before-blocks': 0,
      '@typescript-eslint/space-before-function-paren': 0,
      '@typescript-eslint/space-infix-ops': 0,
      '@typescript-eslint/type-annotation-spacing': 0
    }
  }]
}