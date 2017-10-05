import * as assert from 'assert';
import { configure, shallow } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as sinon from 'sinon';
import { ListItem, Props } from './Item';

configure({ adapter: new Adapter() });

const getShallowInstance = (newProps?: Partial<Props>) => {
  const props = _.assign({ id: '1', title: 'lol' }, newProps);
  return { wrapper: shallow(<ListItem {...props} />), props };
};

describe('Item', () => {
  it('should render html', () => {
    const html = (
      <div className='list__item'>
        <div className='list__item__img' style={{ backgroundImage: 'none' }}></div>
        <div className='list__item__content'>
          <div className='list__item__title'>lol</div>
          <div className='list__item__subtitle'>-</div>
        </div>
      </div>
    );

    assert.strictEqual(shallow(html).html(), getShallowInstance().wrapper.html());
  });

  it('should render html with subtitle', () => {
    const html = (
      <div className='list__item'>
        <div className='list__item__img' style={{ backgroundImage: 'none' }}></div>
        <div className='list__item__content'>
          <div className='list__item__title'>lol</div>
          <div className='list__item__subtitle'>subtitle</div>
        </div>
      </div>
    );

    assert.strictEqual(
      shallow(html).html(),
      getShallowInstance({ desc: 'subtitle' }).wrapper.html()
    );
  });

  it('should render html with bakgroundImage', () => {
    const html = (
      <div className='list__item'>
        <div className='list__item__img' style={{ backgroundImage: 'url("a/b")' }}></div>
        <div className='list__item__content'>
          <div className='list__item__title'>lol</div>
          <div className='list__item__subtitle'>-</div>
        </div>
      </div>
    );

    assert.strictEqual(
      shallow(html).html(),
      getShallowInstance({ imgUrl: 'a/b' }).wrapper.html()
    );
  });

  it('should render html with item selected', () => {
    const html = (
      <div className='list__item is-selected'>
        <div className='list__item__img' style={{ backgroundImage: 'none' }}></div>
        <div className='list__item__content'>
          <div className='list__item__title'>lol</div>
          <div className='list__item__subtitle'>-</div>
        </div>
      </div>
    );

    assert.strictEqual(
      shallow(html).html(),
      getShallowInstance({ itemSelected: '1' }).wrapper.html()
    );
  });

  it('should trigger double click cb with props', () => {
    const spyFn = sinon.spy();
    const shallowInstance = getShallowInstance({ onDoubleClick: spyFn });

    assert(spyFn.notCalled);
    shallowInstance.wrapper.simulate('doubleclick');
    assert(spyFn.calledOnce);
    assert(spyFn.calledWithExactly(shallowInstance.props));
  });

  it('should trigger right click cb with props', () => {
    const spyFn = sinon.spy();
    const shallowInstance = getShallowInstance({ onContextMenu: spyFn });

    assert(spyFn.notCalled);
    shallowInstance.wrapper.simulate('contextmenu');
    assert(spyFn.calledOnce);
    assert(spyFn.calledWithExactly(shallowInstance.props));
  });
});
