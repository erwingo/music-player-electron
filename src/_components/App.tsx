// TODO: Ideal to cherry pick only what you need, waiting for this tho
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/7896
// import * as shuffle from 'lodash/fp/shuffle';

import * as _ from 'lodash';
import * as React from 'react';
import { getAbsPathFromFilesRootPath, getJsonFromFile } from '../_helpers';
import { getFilesRootPath } from '../_singletons/main';
import * as types from '../types';
import './App.scss';
import { AudioCore } from './AudioCore';
import { List, ListItemProps } from './List';
import { Player } from './Player';
import { Sidebar } from './Sidebar';

interface NewSong extends types.Song {
  title: string;
  desc: string;
  allCovers: string[];
  imgUrl?: string;
}

const allSongs: NewSong[] =
  (getJsonFromFile(getAbsPathFromFilesRootPath('_data/songs.json')) as types.Song[])
    .map(song => {
      const allCovers = [...song.covers, ...song.albumCovers, ...song.artistCovers];
      const firstCover = allCovers[0] as (string | undefined);

      return {
        ...song,
        title: song.name,
        desc: song.albumId ? song.artistId + ' - ' + song.albumId : song.artistId,
        allCovers,
        imgUrl: firstCover ? getAbsPathFromFilesRootPath(firstCover) : undefined
      };
    });

// const artists: types.Artist[] =
//   getJsonFromFile(getAbsPathFromFilesRootPath('_data/artists.json'));

// const albums: types.Artist[] =
//   getJsonFromFile(getAbsPathFromFilesRootPath('_data/albums.json'));

interface State {
  volume: number;
  isRepeated: boolean;
  isShuffled: boolean;
  isPlaying: boolean;
  currentSongId?: string;
  middleSection: {
    title: string;
    items: NewSong[]
  };
  rightSection: {
    items: NewSong[]
  };
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
    this.handleMiddleSectionItemDblClick = this.handleMiddleSectionItemDblClick.bind(this);
    this.handleDragCompleted = this.handleDragCompleted.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handlePlayOrPauseClick = this.handlePlayOrPauseClick.bind(this);
    this.handleSidebarSectItemClick = this.handleSidebarSectItemClick.bind(this);
    this.handleRightSectionItemDblClick = this.handleRightSectionItemDblClick.bind(this);
    this.handleSidebarSectItemDblClick = this.handleSidebarSectItemDblClick.bind(this);
    this.handleShuffleClick = this.handleShuffleClick.bind(this);

    this.state = {
      isPlaying: false,
      volume: 1,
      isRepeated: false,
      isShuffled: false,
      middleSection: { title: '', items: [] },
      rightSection: { items: [] },
      player: {}
    };

    audioCoreEl.onEnd = () => {
      const queue = this.state.rightSection.items;
      const newSongIdx = queue.findIndex(el => el.id === this.state.currentSongId) + 1;

      if (newSongIdx >= queue.length) {
        if (this.state.isRepeated) {
          this.setPlayingPlaylist(queue, { shuffle: false, songIdxToPlay: 0 });
        }
      } else {
        this.setPlayingPlaylist(queue, { shuffle: false, songIdxToPlay: newSongIdx });
      }
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

  setPlayingPlaylist(
    songs: NewSong[],
    options: {
      shuffle?: boolean,
      songIdxToPlay?: number,
      songIdToPlay?: string,
      state?: any
    } = {}
  ) {
    let newSongs = songs;
    if (options.shuffle) { newSongs = _.shuffle(songs); }

    let player = this.state.player;
    let songToPlay: NewSong | undefined;
    if (typeof options.songIdxToPlay === 'number') {
      songToPlay = newSongs[options.songIdxToPlay];
    } else if (options.songIdToPlay) {
      songToPlay = newSongs.find(el => el.id === options.songIdToPlay);
    }

    let currentSongId = this.state.currentSongId;
    if (songToPlay) {
      const filePath = songToPlay.path + '/_file' + songToPlay.fileExtension;
      audioCoreEl.setSrc(getAbsPathFromFilesRootPath(filePath));
      audioCoreEl.play(0);
      currentSongId = songToPlay.id;
      player = {
        title: songToPlay.title,
        subtitle: songToPlay.desc,
        imgUrl: songToPlay.imgUrl
      };
    }

    this.setState({
      ...this.state,
      isPlaying: !!songToPlay,
      rightSection: { items: newSongs },
      currentSongId,
      player,
      ...options.state
    });
  }

  handleMiddleSectionItemDblClick(item: ListItemProps) {
    const song = allSongs.find(el => el.id === item.id)!;
    const songs = this.state.middleSection.items
      .map(el => allSongs.find(el2 => el2.id === el.id)!);

    this.setPlayingPlaylist(songs, {
      shuffle: this.state.isShuffled,
      songIdToPlay: song.id
    });
  }

  handleRightSectionItemDblClick(item: ListItemProps) {
    this.setPlayingPlaylist(this.state.rightSection.items, {
      shuffle: false,
      songIdToPlay: item.id
    });
  }

  handleSidebarSectItemClick(section: string, item: string) {
    let newMiddleSection: { title: string; items: NewSong[] };

    if (section === 'library' && item === 'allsongs') {
      newMiddleSection = {
        title: 'All Songs',
        items: allSongs
      };
    } else {
      newMiddleSection = { title: '-', items: [] };
    }

    this.setState({
      ...this.state,
      middleSection: { ...newMiddleSection }
    });
  }

  handleSidebarSectItemDblClick(section: string, item: string) {
    const items = allSongs;

    this.setPlayingPlaylist(items, {
      shuffle: this.state.isShuffled,
      songIdxToPlay: 0
    });
  }

  handleShuffleClick() {
    const shouldShuffle = !this.state.isShuffled;
    this.setPlayingPlaylist(
      shouldShuffle ? this.state.rightSection.items : this.state.middleSection.items,
      { shuffle: shouldShuffle, state: { isShuffled: shouldShuffle } }
    );
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
            onShuffleBtnClick: this.handleShuffleClick
          }}
        />
        <Sidebar
          className='app__sidebar'
          onSectionItemClick={this.handleSidebarSectItemClick}
          onSectionItemDblClick={this.handleSidebarSectItemDblClick}
          sections={[
            {
              id: 'library',
              title: 'Library',
              items: [{ id: 'allsongs', title: 'All Songs' }]
            }
          ]}
        />
        <List
          className='app__middlesection'
          title={this.state.middleSection.title}
          items={this.state.middleSection.items}
          onItemDoubleClick={this.handleMiddleSectionItemDblClick}
        />
        <List
          className='app__rightsection'
          title='Playing'
          items={this.state.rightSection.items}
          onItemDoubleClick={this.handleRightSectionItemDblClick}
        />
      </div>
    );
  }
}
