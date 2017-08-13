const fs = require('fs-extra');

class StringReplacer {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, cb) => {
      let newFileContent = fs.readFileSync(this.options.input, 'utf8');

      (this.options.replacements || []).forEach(el => {
        newFileContent = newFileContent.replace(
          el.pattern,
          el.replacement
        );
      });

      compilation.assets[this.options.output] = {
        source: () => newFileContent,
        size: () => newFileContent.length
      };

      cb();
    });
  }
}

module.exports = StringReplacer;
