const webpackConfig = require('./config/webpack.config');

module.exports = config => {
  config.set({
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level: how many browser should be started simultaneous
    concurrency: Infinity,

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],

    // level of logging: LOG_DISABLE || _ERROR || .LOG_WARN || // .LOG_INFO || .LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // list of files / patterns to load in the browser
    files: [
      'src/**/*.tests.tsx',
      'src/**/_tests.tsx',
      'src/**/_tests/**/*.tsx'
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.tests.tsx': ['electron', 'webpack', 'sourcemap'],
      'src/**/_tests.tsx': ['electron', 'webpack', 'sourcemap'],
      'src/**/_tests/**/*.tsx': ['electron', 'webpack', 'sourcemap']
    },

    // To get node integration privileges like access to module object
    // https://github.com/twolfson/karma-electron#getting-started
    client: {
      useIframe: false
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Electron'],

    // Webpack config options
    webpack: {
      ...webpackConfig,

      // Somehow karma is not reading the node_modules directory, so we re-include
      // them here by saying they are not external modules
      externals: ''
    },
    webpackMiddleware: {
      quiet: true,
      stats: {
        hash: false,
        version: false,
        timings: false,
        assets: false,
        colors: false,
        chunks: false,
        modules: false,
        errors: true
      }
    },

    plugins: [
      // Browsers
      'karma-electron',

      // Test Frameworks
      'karma-mocha',

      // Bundler
      'karma-webpack',
      'karma-sourcemap-loader',

      // Reporters
      'karma-mocha-reporter',
      'karma-coverage'
    ]
  });
};
