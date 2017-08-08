import * as classnames from 'classnames';
import * as React from 'react';
import { Slider } from '../Slider';
import './index.scss';
import { MediaManager, Props as MediaManagerProps } from './MediaManager';

interface Props {
  className?: string;
  volume?: number;
  isPlaying?: boolean;
  onVolumeChange?: (value: number) => void;
  onPlayOrPauseClick?: () => void;
  mediaManager?: MediaManagerProps;
}

export class Player extends React.PureComponent<Props, any> {
  render() {

    return (
      <div className={classnames('player', this.props.className)}>
        <Slider
          className='player__volume'
          value={this.props.volume}
          step={0.05}
          minValue={0}
          maxValue={1}
          onChange={this.props.onVolumeChange}
        />

        <div className='player__controls'>
          <div
            className='player__controls__prevnext icon is-fast-backward'
          />
          <div
            onClick={this.props.onPlayOrPauseClick}
            className={classnames(
              'player__controls__playpause icon',
              this.props.isPlaying ? 'is-circle-pause' : 'is-circle-play'
            )}
          />
          <div
            className='player__controls__prevnext icon is-fast-forward'
          />
        </div>
        <MediaManager {...this.props.mediaManager} />
      </div>
    );
  }
}
