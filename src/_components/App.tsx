import * as React from 'react';
import { getAbsPathFromFilesRootPath, getJsonFromFile } from '../_helpers';
import { getFilesRootPath } from '../_singletons/main';
import * as types from '../types';
import './App.scss';
import { AudioCore } from './AudioCore';
import { List, ListItemProps } from './List';
import { Player } from './Player';

const songs =
  (getJsonFromFile(getAbsPathFromFilesRootPath('_data/songs.json')) as types.Song[])
    .map(song => ({
      ...song,
      title: song.name,
      desc: song.albumId ? song.artistId + ' - ' + song.albumId : song.artistId,
      imgUrl: song.covers[0] ? getAbsPathFromFilesRootPath(song.covers[0]) : undefined
    }));

// const artists: types.Artist[] =
//   getJsonFromFile(getAbsPathFromFilesRootPath('_data/artists.json'));

// const albums: types.Artist[] =
//   getJsonFromFile(getAbsPathFromFilesRootPath('_data/albums.json'));

interface State {
  volume: number;
  isRepeated: boolean;
  isShuffled: boolean;
  isPlaying: boolean;
  player: {
    title?: string;
    subtitle?: string;
    imgUrl?: string;
    currentTime?: number;
    duration?: number;
  };
}

const audioCoreEl = new AudioCore();

export class App extends React.Component<any, State> {
  constructor() {
    super();
    this.handleItemDoubleClick = this.handleItemDoubleClick.bind(this);
    this.handleDragCompleted = this.handleDragCompleted.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handlePlayOrPauseClick = this.handlePlayOrPauseClick.bind(this);

    this.state = {
      isPlaying: false,
      volume: 1,
      isRepeated: false,
      isShuffled: false,
      player: {}
    };

    audioCoreEl.onProgress = (time: number, duration: number) => {
      this.setState({
        ...this.state,
        player: {
          ...this.state.player,
          currentTime: time,
          duration: duration
        }
      });
    };
  }

  handleDragCompleted(value: number) {
    audioCoreEl.setCurrentTime(value);
  }

  handleVolumeChange(value: number) {
    audioCoreEl.setVolume(value);
    this.setState({ ...this.state, volume: value });
  }

  handlePlayOrPauseClick() {
    const shouldPlay = !this.state.isPlaying;

    if (shouldPlay) {
      audioCoreEl.play();
    } else {
      audioCoreEl.pause();
    }

    this.setState({ ...this.state, isPlaying: shouldPlay });
  }

  handleItemDoubleClick(item: ListItemProps) {
    const song = songs.find(el => el.id === item.id)!;
    const fileUrl = song!.path + '/_file' + song.fileExtension;
    audioCoreEl.setSrc(getAbsPathFromFilesRootPath(fileUrl));
    audioCoreEl.play(0);

    this.setState({
      ...this.state,
      isPlaying: true,
      player: {
        title: song.name,
        subtitle: song.desc,
        imgUrl: song.imgUrl
      }
    });
  }

  render() {
    return (
      <div className='app'>
        <Player
          className='app__player'
          volume={this.state.volume}
          onVolumeChange={this.handleVolumeChange}
          onPlayOrPauseClick={this.handlePlayOrPauseClick}
          isPlaying={this.state.isPlaying}
          mediaManager={{
            title: this.state.player.title,
            subtitle: this.state.player.subtitle,
            imgUrl: this.state.player.imgUrl,
            currentTime: this.state.player.currentTime,
            duration: this.state.player.duration,
            isRepeated: this.state.isRepeated,
            isShuffled: this.state.isShuffled,
            onDragCompleted: this.handleDragCompleted,
            onRepeatBtnClick: () => {
              this.setState({ ...this.state, isRepeated: !this.state.isRepeated });
            },
            onShuffleBtnClick: () => {
              this.setState({ ...this.state, isShuffled: !this.state.isShuffled });
            }
          }}
        />
        <List
          className='app__allsongs'
          title='All Songs'
          items={songs}
          onItemDoubleClick={this.handleItemDoubleClick}
        />
        <List
          className='app__playing'
          title='Playing'
        />
      </div>
    );
  }
}
