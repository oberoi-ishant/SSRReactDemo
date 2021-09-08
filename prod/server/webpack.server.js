const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const webpackNodeExternals = require('webpack-node-externals');

const serverConfig = {
  // inform webpack that we are building a bundle for NODEJs and not browser
  target: 'node',

  // tell webpack the root file of our server application
  entry: './src/index.js',

  // tell webpack where to put the output file that is generated
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },

  // tell webpack not to bundle any node_modules with the sever bundle.js
  /**
   * With node you can require modules at runtime when server first starts up.
   * So no need to bundle the libs in the bundle.js
   */
  externals: [webpackNodeExternals()]
};

module.exports = merge(baseConfig, serverConfig);
