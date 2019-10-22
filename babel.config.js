module.exports = function generateConfig(api) {
  api.cache(true);
  return {
    presets: [['@babel/preset-env'], '@babel/preset-react', '@babel/preset-flow'],
    ignore: ['__mocks__'],
    plugins: [
      'babel-plugin-lodash',
      'babel-plugin-styled-components',
      'babel-plugin-react-docgen',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-syntax-import-meta',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-json-strings',
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true,
        },
      ],
      '@babel/plugin-proposal-function-sent',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-numeric-separator',
      '@babel/plugin-proposal-throw-expressions',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-logical-assignment-operators',
      '@babel/plugin-proposal-optional-chaining',
      [
        '@babel/plugin-proposal-pipeline-operator',
        {
          proposal: 'minimal',
        },
      ],
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-do-expressions',
      'dev-expression',
    ],
    env: {
      test: {
        plugins: ['require-context-hook'],
      },
    },
  };
};
