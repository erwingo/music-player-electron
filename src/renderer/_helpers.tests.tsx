import * as assert from 'assert';
import { getBgImgUrl, getJsonFromFile } from './_helpers';

describe('_helpers', () => {
  describe(`#${(getJsonFromFile as any).name}`, () => {
    it('should return an empty object', () => {
      const mod = {
        readJsonSync: (name: string) => name
      };

      assert.strictEqual(getJsonFromFile('lol', mod), 'lol');
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
