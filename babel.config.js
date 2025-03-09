module.exports = {
  presets: [
    // Automatically polyfills modern JavaScript based on target environments
    ['@babel/preset-env', { targets: { electron: '34.0.0' } }],

    // Supports TypeScript syntax in Babel
    '@babel/preset-typescript',

    // Enables JSX without importing React explicitly
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
    // This will handle all `token()` calls outside of Compiled
    '@atlaskit/tokens/babel-plugin',

    // ↓↓ Compiled should run last ↓↓
    [
      '@compiled/babel-plugin',
      { transformerBabelPlugins: ['@atlaskit/tokens/babel-plugin'] },
    ],
  ],
};
