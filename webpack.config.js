const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const nodeEnv = process.env.NODE_ENV;
const development = nodeEnv !== 'production';

const cssLoader = development ?
  'style-loader!css-loader!sass-loader' :
  ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader!sass-loader' });

const babelPresets = [
  [require.resolve('babel-preset-es2015'), { loose: true, modules: false }],
  require.resolve('babel-preset-react'),
  require.resolve('babel-preset-stage-2'),
];

if (development) {
  babelPresets.push(require.resolve('babel-preset-react-hmre'));
}

const config = {
  context: path.join(__dirname, '/client'),
  entry: './index',
  module: {
    loaders: [{
      test: /\.html$/,
      loader: 'html-loader',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.(gif|png|jpg|jpeg|ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
      loader: 'file-loader',
    }, {
      test: /\.(scss|css|less)$/,
      loader: cssLoader,
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      include: [
        path.resolve('./client'),
        // es6 modules
        fs.realpathSync('./node_modules/@digix/react-components'),
        fs.realpathSync('./node_modules/ethereumjs-tx'),
      ],
      query: { presets: babelPresets },
    }],
  },
  resolve: {
    // fix peerDependencies with `npm link`
    alias: {
      react: path.resolve('./node_modules/react'),
    },
  },
  plugins: [new HtmlWebpackPlugin({ template: './index.html' })],
};

if (development) {
  config.devtool = 'cheap-module-eval-source-map';
  config.output = {
    publicPath: '/',
  };
  config.devServer = {
    contentBase: './client',
  };
  config.watchOptions = {
    ignored: '/node_modules/',
  };
} else {
  config.devtool = 'souce-map';
  config.output = {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
    publicPath: '/',
  };
  config.plugins = config.plugins.concat([
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      comments: false,
    }),
  ]);
}

module.exports = config;
