import { ElectronStore } from '../_components/ElectronStore';

let filesRootPath = '/Users/erwin/MEGAsync/music-player-files';

export const electronStore = new ElectronStore();

export const defaultPreferences = {
  volume: 1,
  isShuffled: false,
  isRepeated: false
};

export function getFilesRootPath() {
  return filesRootPath;
}

export function setFilesRootPath(newPath: string) {
  filesRootPath = newPath;
}
