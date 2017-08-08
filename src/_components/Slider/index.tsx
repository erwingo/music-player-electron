import * as classnames from 'classnames';
import * as React from 'react';

// TODO: You need to use this import
// https://github.com/davidchin/react-input-range/pull/90
import * as InputRange from 'react-input-range';
// import InputRange from 'react-input-range';

import 'react-input-range/lib/css/index.css';
import './index.scss';

interface Props {
  className?: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  onDragCompleted?: (value: number) => void;
}

interface State {
  value: number;
}

export class Slider extends React.Component<Props, State> {
  shouldUpdate = true;

  constructor(props: Props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeComplete = this.handleChangeComplete.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.state = {
      value: props.value || 0
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.shouldUpdate) { return; }

    this.setState({
      ...this.state,
      value: nextProps.value || this.state.value
    });
  }

  handleChange(value: number) {
    if (this.props.onChange) { this.props.onChange(value); }
    this.setState({ ...this.state, value });
  }

  // TODO: This doesnt work as expected when dragging really fast
  // so probably use another react component
  handleChangeComplete(value: number) {
    if (this.props.onDragCompleted) { this.props.onDragCompleted(value); }
  }

  handleMouseUp() {
    this.shouldUpdate = true;
    const value = (this.refs.inputRange as any).props.value as number;
    if (this.props.onDragCompleted) { this.props.onDragCompleted(value); }
  }

  handleChangeStart() {
    this.shouldUpdate = false;
  }

  render() {
    const minValue = this.props.minValue || 0;
    const maxValue = this.props.maxValue || 1;
    let value = this.state.value;
    value = value <= maxValue ? value : 0;

    return (
      <div
        className={classnames('slider', this.props.className)}
        onMouseUp={this.handleMouseUp}
      >
        <InputRange
          ref='inputRange'
          maxValue={maxValue}
          minValue={minValue}
          step={this.props.step}
          value={value}
          onChange={this.handleChange}
          onChangeComplete={this.handleChangeComplete}
          onChangeStart={this.handleChangeStart}
        />
      </div>
    );
  }
}
