import * as assert from 'assert';
import { formatSecondsToTime } from './_helpers';

describe('_helpers', () => {
  describe(`#${(formatSecondsToTime as any).name}`, () => {
    it('should return -:-- if no param passed', () => {
      assert.strictEqual(formatSecondsToTime(), '-:--');
    });

    it('should return 0:00 if param is 0', () => {
      assert.strictEqual(formatSecondsToTime(0), '0:00');
    });

    it('should return 3:10 if param is 190', () => {
      assert.strictEqual(formatSecondsToTime(190), '3:10');
    });
  });
});
