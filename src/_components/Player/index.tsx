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

export function Player(props: Props) {
  return (
    <div className={classnames('player', props.className)}>
      <Slider
        className='player__volume'
        value={props.volume}
        step={0.05}
        minValue={0}
        maxValue={1}
        onChange={props.onVolumeChange}
      />

      <div className='player__controls'>
        <div
          className='player__controls__prevnext icon is-fast-backward'
        />
        <div
          onClick={props.onPlayOrPauseClick}
          className={classnames(
            'player__controls__playpause icon',
            props.isPlaying ? 'is-circle-pause' : 'is-circle-play'
          )}
        />
        <div
          className='player__controls__prevnext icon is-fast-forward'
        />
      </div>
      <MediaManager {...props.mediaManager} />
    </div>
  );
}
