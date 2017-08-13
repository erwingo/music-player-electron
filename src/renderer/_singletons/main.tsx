let filesRootPath = '/Users/erwin/MEGAsync/music-player-files';

export function getFilesRootPath() {
  return filesRootPath;
}

export function setFilesRootPath(newPath: string) {
  filesRootPath = newPath;
}
