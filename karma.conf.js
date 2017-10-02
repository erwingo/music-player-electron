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
      { pattern: './config/karma.shim.js', watched: true, included: true, served: true },
      // 'src/**/*.tsx',
      'src/**/*.tests.tsx',
      'src/**/_tests.tsx',
      'src/**/_tests/**/*.tsx'
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // 'src/**/*.tsx': ['electron', 'webpack', 'sourcemap', 'coverage'],
      'src/**/*.tests.tsx': ['webpack', 'sourcemap'],
      'src/**/_tests.tsx': ['webpack', 'sourcemap'],
      'src/**/_tests/**/*.tsx': ['webpack', 'sourcemap']
    },

    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Electron'],

    // Webpack config options
    webpack: webpackConfig,
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

    // Mocha reporter options
    mochaReporter: {
      showDiff: true
    },

    // Coverage reporter options
    coverageReporter: {
      reporters: [
        { type: 'text-summary' },
        {
          type: 'html',
          dir: 'coverage/'
        }
      ]
    },

    plugins: [
      // Browsers
      'karma-electron-launcher',

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
