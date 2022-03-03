module.exports = {
  root: true,
  extends: '@react-native-community',
  globals: {
    rlog: 'readonly',
  },
  rules: {
    'react-native/no-inline-styles': 0,
    '@typescript-eslint/no-unused-vars': ['warn'],
  },
};
