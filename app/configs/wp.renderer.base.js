const path = require('path');

const res = p => path.resolve(__dirname, p);
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /.*ssgl-iwad-covers.*jpg$/i,
        loader: 'url-loader'
      },
      {
        test: /^((?!ssgl-iwad-covers).)*\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.(eot|woff|woff2|ttf)([\?]?.*)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(ogg)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[path][name].[ext]'
        }
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: { svgo: false }
          }
        ]
      }
    ]
  },

  output: {
    path: path.join(process.cwd(), 'build'),
    publicPath: '/',
    filename: 'renderer-bundle.js'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      '#': res(`${process.cwd()}/client/`)
    }
  }
};
