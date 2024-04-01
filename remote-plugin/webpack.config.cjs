const { ModuleFederationPlugin } = require('webpack').container
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { dependencies } = require('./package.json')
const { hawtioBackend } = require('@hawtio/backend-middleware')
const path = require('path')

const publicPath = '/hawtio'
const outputPath = path.resolve(__dirname, 'build')

module.exports = {
  entry: './src/index.ts',
  plugins: [
    new ModuleFederationPlugin({
      // The container name corresponds to 'scope' passed to HawtioPlugin
      name: 'remotePlugin',
      filename: 'remoteEntry.js',
      // The key in exposes corresponds to 'remote' passed to HawtioPlugin
      exposes: {
        './plugin': './src/remote-plugin',
      },
      shared: {
        ...dependencies,
        react: {
          singleton: true,
          requiredVersion: dependencies['react'],
        },
        'react-dom': {
          singleton: true,
          requiredVersion: dependencies['react-dom'],
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: dependencies['react-router-dom'],
        },
        '@hawtio/react': {
          singleton: true,
          requiredVersion: '^1.2.0',
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      favicon: path.resolve(__dirname, 'public/favicon.ico'),
      // Trailing slash is really important for proper base path handling
      base: publicPath + '/',
      publicPath,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          to: outputPath,
          context: 'public/',
          globOptions: {
            gitignore: true,
            ignore: ['**/index.html', '**/favicon.ico'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  output: {
    clean: true,
    path: outputPath,
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[name].[hash][ext]',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
              },
            },
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.md$/i,
        type: 'asset/source',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  ignoreWarnings: [/Failed to parse source map/, /Critical dependency: the request of a dependency is an expression/],
  performance: {
    maxAssetSize: 1000000, // 1MB for now
  },
  devServer: {
    port: 3001,
    static: outputPath,
    historyApiFallback: true,
    devMiddleware: { publicPath },
    setupMiddlewares: (middlewares, devServer) => {
      // Enabling branding in dev mode
      devServer.app.use((req, _, next) => {
        if (req.url.startsWith('/remote-plugin')) {
          req.url = req.url.replace(/\/remote-plugin(.*)/, `${publicPath}$1`)
        }
        next()
      })

      // Redirect / or /hawtio to /hawtio/
      if (publicPath && publicPath !== '/') {
        devServer.app.get('/', (_, res) => res.redirect(`${publicPath}/`))
        devServer.app.get(`${publicPath}$`, (_, res) => res.redirect(`${publicPath}/`))
      }

      const username = 'developer'
      const proxyEnabled = true
      const plugin = []
      const hawtconfig = {}

      // Hawtio backend API mock
      let login = true
      devServer.app.get(`${publicPath}/user`, (_, res) => {
        login ? res.send(`"${username}"`) : res.sendStatus(403)
      })
      devServer.app.post(`${publicPath}/auth/login`, (_, res) => {
        login = true
        res.send(String(login))
      })
      devServer.app.get(`${publicPath}/auth/logout`, (_, res) => {
        login = false
        res.redirect(`${publicPath}/login`)
      })
      devServer.app.get(`${publicPath}/auth/config*`, (_, res) => {
        res.send('{}')
      })
      devServer.app.get(`${publicPath}/proxy/enabled`, (_, res) => res.send(String(proxyEnabled)))
      devServer.app.get(`${publicPath}/plugin`, (_, res) => res.send(JSON.stringify(plugin)))

      // hawtconfig.json mock
      devServer.app.get(`${publicPath}/hawtconfig.json`, (_, res) => res.send(JSON.stringify(hawtconfig)))

      // Hawtio backend middleware should be run before other middlewares (thus 'unshift')
      // in order to handle GET requests to the proxied Jolokia endpoint.
      middlewares.unshift({
        name: 'hawtio-backend',
        path: `${publicPath}/proxy`,
        middleware: hawtioBackend({
          // Uncomment it if you want to see debug log for Hawtio backend
          logLevel: 'debug',
        }),
      })

      return middlewares
    },
  },
}
