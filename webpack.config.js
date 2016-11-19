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
  require.resolve('babel-preset-es2015'),
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
      loader: 'html',
    }, {
      test: /\.json$/,
      loader: 'json',
    }, {
      test: /\.(gif|png|jpg|jpeg|ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
      loader: 'file',
    }, {
      test: /\.(scss|css|less)$/,
      loader: cssLoader,
    }, {
      test: /\.js$/,
      loader: 'babel',
      include: [
        path.resolve('./client'),
        // `npm link`ed modules
        fs.realpathSync('./node_modules/@digix/react-components'),
      ],
      query: { presets: babelPresets },
    }],
  },
  // resolve: { fallback: path.join(__dirname, 'node_modules') },
  resolve: {
    // extensions: ['', '.js', '.jsx'],
    // modules: [
    //   path.resolve('./client'),
    //   'node_modules'
    // ],
    // loaders: [
    //   path.resolve('./client'),
    //   'node_modules'
    // ],
    // fix peerDependencies with `npm link`
    alias: {
      react: path.resolve('./node_modules/react'),
    },
  },
  // resolveLoader: { fallback: path.join(__dirna,me, 'node_modules') },
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
  config.output = {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
    publicPath: '/wallet-migration/migrate/',
  };
  config.plugins = config.plugins.concat([
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   mangle: false,
    //   compress: {
    //     warnings: false,
    //   },
    //   output: {
    //     comments: false,
    //   },
    // }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
    }),
    new ExtractTextPlugin('style.css'),
  ]);
}

module.exports = config;
