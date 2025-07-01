module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'semi': ['error', 'always'],
    'quotes': ['warn', 'single', { 'allowTemplateLiterals': true }]
  },
  globals: {
    'tsParticles': 'readonly'
  }
}; 