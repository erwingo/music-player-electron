import * as classnames from 'classnames';
import * as React from 'react';
import { getBgImgUrl } from '../../_helpers';
import { Slider } from '../Slider';

export interface Props {
  imgUrl?: string;
  title?: string;
  subtitle?: string;
  isShuffled?: boolean;
  isRepeated?: boolean;
  currentTime?: number;
  duration?: number;
  onRepeatBtnClick?: () => void;
  onShuffleBtnClick?: () => void;
  onDragCompleted?: (value: number) => void;
}

function convertSecondsToMinutesTime(seconds?: number) {
  if (typeof seconds === 'undefined' || isNaN(seconds)) {
    return '-:--';
  }

  const minutes = Math.floor(seconds / 60);
  const newSeconds = String(Math.floor(seconds % 60));
  const pad = '00';
  return `${minutes}:${(pad + newSeconds).substring(newSeconds.length)}`;
}

export class MediaManager extends React.Component<Props, any> {
  render() {
    return (
      <div className='player__mediamanager'>
        <div
          className='player__mediamanager__img'
          style={{ backgroundImage: getBgImgUrl(this.props.imgUrl) }}
        />
        <div className='player__mediamanager__content'>
          <div className='player__mediamanager__title'>
            { this.props.title || '-' }
          </div>
          <div className='player__mediamanager__subtitle'>
            { this.props.subtitle || '-' }
          </div>
          <div
            onClick={this.props.onShuffleBtnClick}
            className={classnames(
              'player__mediamanager__btn1 icon is-circle-shuffle',
              { 'is-active': this.props.isShuffled }
            )}
          />
          <div
            onClick={this.props.onRepeatBtnClick}
            className={classnames(
              'player__mediamanager__btn2 icon is-circle-repeat',
              { 'is-active': this.props.isRepeated }
            )}
          />

          <div className='player__mediamanager__slider'>
            <div className='player__mediamanager__slider__time1'>
              {convertSecondsToMinutesTime(
                this.props.currentTime ?
                  this.props.currentTime :
                  this.props.duration ? 0 : undefined
              )}
            </div>
            <div className='player__mediamanager__slider__time2'>
              {convertSecondsToMinutesTime(this.props.duration)}
            </div>

            <Slider
              className='player__mediamanager__slider__item'
              minValue={0}
              maxValue={this.props.duration}
              value={this.props.currentTime}
              onDragCompleted={this.props.onDragCompleted}
            />
          </div>
        </div>
      </div>
    );
  }
}
