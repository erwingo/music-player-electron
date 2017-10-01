import * as fs from 'fs-extra';
import * as path from 'path';
import { getFilesRootPath } from '../_singletons/main';

export function getJsonFromFile(filepath: string, fsInj: { readJsonSync: any } = fs) {
  return fsInj.readJsonSync(filepath);
}

export function getAbsPathFromFilesRootPath(
  newPath: string,
  getFilesRootPathInj = getFilesRootPath
) {
  return path.join(getFilesRootPathInj(), newPath);
}

export function getBgImgUrl(url?: string) {
  if (typeof url === 'undefined') { return 'none'; }

  // NOTE: encodeURI encodes double quotes but not single quotes that's
  // why I use double quotes inside the url function
  return `url("${encodeURI(url.replace(/\\/g, '/'))}")`;
}
