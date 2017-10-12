import * as assert from 'assert';
import { configure, shallow } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Player } from './';

configure({ adapter: new Adapter() });

describe('Player', () => {
  it('renders proper structure', () => {
    assert.doesNotThrow(() => {
      const shallowWrapper = shallow(<Player />);

      assert(shallowWrapper.find('.player__controls').length === 1);

      const playerControlWrapper = shallowWrapper.find('.player__controls');
      assert(playerControlWrapper.length === 1);

      assert(playerControlWrapper.find('.player__controls__prevnext').length === 2);
      assert(playerControlWrapper.find('.player__controls__playpause').length === 1);
    });
  });
});
