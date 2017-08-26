// TODO: This should be only for the renderer,
// the main process should only update the store

const electronStore = require('./electronStore');

let filesRootPath = electronStore.store.get(electronStore.ROOT_PATH);

module.exports.getFilesRootPath = () => {
  return filesRootPath;
};

// TODO: validate that the root dir is good (use directory-validator)
module.exports.isAValidFilesRootPath = () => {
  if (filesRootPath) { return true; }
  return false;
};

module.exports.setFilesRootPath = newPath => {
  filesRootPath = newPath;
};
