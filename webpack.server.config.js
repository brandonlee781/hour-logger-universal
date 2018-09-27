const webpack = require('webpack');
const fs = require('path');
const WebpackConfigFactory = require('@nestjs/ng-universal')
  .WebpackConfigFactory;

/**
 * In fact, passing following configuration to the WebpackConfigFactory is not required
 * default options object returned from this method has equivalent entries defined by default.
 *
 * Example: WebpackConfigFactory.create(webpack);
 */
// module.exports = WebpackConfigFactory.create(webpack, {
//   // This is our Nest server for Dynamic universal
//   server: './server/main.ts',
//   // This is an example of Static prerendering (generative)
//   prerender: './prerender.ts',
// });

module.exports = {
  entry: {
    // This is our Nest server for Dynamic universal
    server: './server/main.ts',
    // This is an example of Static prerendering (generative)
    prerender: './prerender.ts',
  },
  mode: 'none',
  target: 'node',
  resolve: { extensions: ['.ts', '.mjs', '.js'] },
  externals: [/node_modules/],
  output: {
    // Puts the output at the root of the dist folder
    path: fs.join(process.cwd(), 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' },
      {
        // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
        // Removing this will cause deprecation warnings to appear.
        test: /(\\|\/)@angular(\\|\/)core(\\|\/).+\.js$/,
        parser: { system: true }
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /((.+)?angular(\\|\/)core(.+)?|express(.+)?|(.+)?nestjs(\\|\/)(.+)?)?/,
      fs.join(process.cwd(), 'src'), // location of your src
      {}
    ),
    new webpack.IgnorePlugin(/^pg-native$/),
    new webpack.IgnorePlugin(/^pg.js.*/),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map'
    })
  ]
};
