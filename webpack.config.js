const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CssNanoWebpackPlugin = require('cssnano-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const PROD = 'production'

const env = (process.env.NODE_ENV || PROD).toLowerCase()
const isProduction = env === PROD

const getPath = relativePath => path.resolve(__dirname, relativePath)

module.exports = {
  mode: env,
  entry: (() => {
    const srcEntry = './src/index.tsx'

    return isProduction ? srcEntry : ['react-hot-loader/patch', srcEntry]
  })(),
  output: {
    filename: '[name].js',
    path: getPath('dist'),
  },
  devtool: !isProduction && 'source-map',
  devServer: {
    port: 8000,
    compress: false,
    hot: true,
    inline: true,
    clientLogLevel: 'error',
    stats: 'errors-only',
  },
  resolve: (() => {
    const config = {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      modules: ['src', 'node_modules'],
      alias: {
        components: getPath('src/components/'),
        images: getPath('src/resources/images/'),
        styles: getPath('src/styles/'),
      },
    }

    if (!isProduction) {
      config.alias['react-dom'] = '@hot-loader/react-dom'
    }

    return config
  })(),
  module: {
    rules: (() => {
      const config = [
        {
          test: /\.tsx?$/,
          include: getPath('src'),
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                onlyCompileBundledFiles: true,
              },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/,
          include: getPath('src'),
          exclude: getPath('src/styles'),
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !isProduction,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProduction,
                modules: {
                  localIdentName: '[local]___[hash:base64:6]',
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [autoprefixer({ grid: 'autoplace' })],
                sourceMap: !isProduction,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProduction,
                sassOptions: {
                  includePaths: [getPath('node_modules')],
                },
              },
            },
            {
              loader: 'resolve-url-loader',
              options: {
                sourceMap: !isProduction,
              },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/,
          include: getPath('src/styles'),
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !isProduction,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProduction,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [autoprefixer({ grid: 'autoplace' })],
                sourceMap: !isProduction,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProduction,
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          include: getPath('src/resources/images'),
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                plugins: !isProduction ? ['react-hot-loader/babel'] : undefined,
              },
            },
            {
              loader: 'react-svg-loader',
              options: {
                jsx: true,
                svgo: {
                  plugins: [{ removeAttrs: { attrs: ['fill', 'width', 'height'] } }],
                  floatPrecision: 2,
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|ico)$/,
          include: getPath('src/resources/images'),
          loader: 'file-loader',
          options: {
            name: './resources/images/[name].[ext]',
          },
        },
        {
          test: /\.(eot|ttf|woff|woff2|svg)$/,
          include: getPath('src/resources/fonts'),
          loader: 'file-loader',
          options: {
            name: './resources/fonts/[name].[ext]',
          },
        },
      ]

      if (isProduction) {
        config.push({
          test: /.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                plugins: !isProduction ? ['react-hot-loader/babel'] : undefined,
              },
            },
          ],
        })
      }

      return config
    })(),
  },
  plugins: (() => {
    const config = [new webpack.ProgressPlugin()]

    if (isProduction) {
      config.push(
        new CleanWebpackPlugin({
          root: process.cwd(),
        })
      )
    }

    config.push(new MiniCssExtractPlugin())

    if (isProduction) {
      config.push(
        new CssNanoWebpackPlugin({
          sourceMap: !isProduction,
          cssnanoOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        })
      )
    }

    config.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        failOnError: true,
        cwd: process.cwd(),
      }),
      new HtmlWebpackPlugin({ template: 'public/index.html', hash: true })
    )

    return config
  })(),
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({ sourceMap: !isProduction, extractComments: false, terserOptions: { output: { comments: !isProduction } } }),
    ],
  },
}
