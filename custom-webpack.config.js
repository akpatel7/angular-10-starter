'use strict';

const { DuplicatesPlugin } = require("inspectpack/plugin");
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const NormalModuleReplacementPlugin = require('webpack').NormalModuleReplacementPlugin;
const WebpackAssetsManifest = require('webpack-assets-manifest');
const path = require('path');

module.exports = config => {
  config.resolve.alias = config.resolve.alias || {};
  config.resolve.alias.lodash = path.resolve(__dirname, 'lodash.custom.js');
  config.resolve.alias['core-js'] = path.resolve(__dirname, 'node_modules/core-js/');

  config.plugins.push(
    new DuplicatesPlugin({
      emitErrors: true,
      verbose: true
    }),
    new NormalModuleReplacementPlugin(/.*moment\.js/, resource => {
      resource.request = path.resolve(__dirname, 'node_modules/moment/moment.js');
    }),
    new NormalModuleReplacementPlugin(/.*tslib.es6\.js/, resource => {
      resource.request = path.resolve(__dirname, 'node_modules/tslib/tslib.es6.js');
    }),
    new NormalModuleReplacementPlugin(/.*signals\.js/, resource => {
      resource.request = path.resolve(__dirname, 'node_modules/signals.js');
    }),
    new MomentLocalesPlugin({
      localesToKeep: ['fr']
    }),
    new WebpackAssetsManifest({})
  );

  config.module.rules.push({
    /*test: /\.extension$/,*/
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto'
  });

  return config;
};
