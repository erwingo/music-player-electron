import * as assert from 'assert';
import { configure, mount, shallow } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as sinon from 'sinon';
import { Props, Slider } from './';

configure({ adapter: new Adapter() });

const getShallowedInstance = (newProps?: Partial<Props>) => {
  const props: Props = { ...newProps };
  return { wrapper: shallow(<Slider {...props} />), props };
};

const getMountedInstance = (newProps?: Partial<Props>) => {
  const props: Props = { ...newProps };
  return { wrapper: mount(<Slider {...props} />), props };
};

describe('Slider', () => {
  it('renders without crashing', () => {
    assert.doesNotThrow(() => {
      shallow(<Slider />);
    });
  });

  it('should render correct classes', () => {
    const wrapper = getShallowedInstance().wrapper;
    assert(wrapper.hasClass('slider'));
  });

  it('should call onDragCompleted(val: number) when onMouseUp', () => {
    const props = { onDragCompleted: sinon.spy() };
    const wrapper = getMountedInstance(props).wrapper;

    wrapper.simulate('mouseup');
    assert(props.onDragCompleted.calledOnce);
    assert(props.onDragCompleted.getCall(0).args.length === 1);
    assert(typeof props.onDragCompleted.getCall(0).args[0] === 'number');
  });
});
