import * as fs from 'fs-extra';
import * as path from 'path';
import { getFilesRootPath } from './_singletons/main';

export function getJsonFromFile(filepath: string) {
  return fs.readJsonSync(filepath);
}

export function getAbsPathFromFilesRootPath(newPath: string) {
  return path.join(getFilesRootPath(), newPath);
}

export function getBgImgUrl(url?: string) {
  if (typeof url === 'undefined') { return; }
  return `url('${url}')`;
}
