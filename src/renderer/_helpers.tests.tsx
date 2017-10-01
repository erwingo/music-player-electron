import * as assert from 'assert';
import { getAbsPathFromFilesRootPath, getBgImgUrl, getJsonFromFile } from './_helpers';

describe('_helpers', () => {
  describe(`#${(getJsonFromFile as any).name}`, () => {
    it('should return an empty object', () => {
      const inj = { readJsonSync: (name: string) => name };
      assert.strictEqual(getJsonFromFile('lol', inj), 'lol');
    });
  });

  describe(`#${(getAbsPathFromFilesRootPath as any).name}`, () => {
    it('should return /a/b if root is /a and path is b', () => {
      assert.strictEqual(getAbsPathFromFilesRootPath('b', () => '/a'), '/a/b');
    });
  });

  describe(`#${(getBgImgUrl as any).name}`, () => {
    it('should return none if no param', () => {
      assert.strictEqual(getBgImgUrl(), 'none');
    });

    it('should return url("url/path") if param "url/path" is passed', () => {
      assert.strictEqual(getBgImgUrl('url/path'), 'url("url/path")');
    });

    it('should return url("%22url/path%22") if param ""url/path"" is passed', () => {
      assert.strictEqual(getBgImgUrl('"url/path"'), 'url("%22url/path%22")');
    });

    it('should return url("url/path") if param "url\\path" is passed', () => {
      assert.strictEqual(getBgImgUrl('url\\path'), 'url("url/path")');
    });
  });
});
