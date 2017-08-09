import { ElectronStore } from '../ElectronStore';

let filesRootPath = '/Users/erwin/MEGAsync/music-player-files';

export const electronStore = new ElectronStore();

export function getFilesRootPath() {
  return filesRootPath;
}

export function setFilesRootPath(newPath: string) {
  filesRootPath = newPath;
}
