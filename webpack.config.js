const HtmlWebPackPlugin = require("html-webpack-plugin");
const PORT = process.env.PORT || '9001';
var path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    index: ['babel-polyfill', './src/index.js']
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [{
          loader: "html-loader"
        }]
      },
      {
        test: /\.css$/,
        use: [{
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        use: [{
          loader: "file-loader",
          options: {
            outputPath: 'images',
            limit: 4192
          }
        }]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    host: "0.0.0.0",
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: PORT,
    historyApiFallback: true,
    disableHostCheck: true,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};