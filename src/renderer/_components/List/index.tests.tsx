import * as assert from 'assert';
import { configure, shallow } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { List } from './';

configure({ adapter: new Adapter() });

describe('List', () => {
  it('renders without crashing', () => {
    assert.doesNotThrow(() => {
      shallow(<List title='Noice' />);
    });
  });
});
