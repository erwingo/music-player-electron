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
    this.handleSidebarSectItemDblClick = this.handleSidebarSectItemDblClick.bind(this);

    this.state = {
      isPlaying: false,
      volume: 1,
      isRepeated: false,
      isShuffled: false,
      middleSection: { title: '', items: [] },
      rightSection: { items: [] },
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

  playSongFromPlaylist(songs: NewSong[], songIdx?: number, songId?: string) {
    let song: NewSong | undefined;
    if (typeof songIdx === 'number') {
      song = songs[songIdx];
    } else if (songId) {
      song = songs.find(el => el.id === songId);
    }

    if (song) {
      const filePath = song.path + '/_file' + song.fileExtension;
      audioCoreEl.setSrc(getAbsPathFromFilesRootPath(filePath));
      audioCoreEl.play(0);
    }

    return song;
  }

  setPlayingPlaylist(
    songs: NewSong[],
    options: {
      songIdxToPlay?: number,
      songIdToPlay?: string
    } = {}
  ) {
    let newSongs: NewSong[];

    if (this.state.isShuffled) {
      newSongs = _.shuffle(songs);
    } else {
      newSongs = songs;
    }

    let player = this.state.player;
    const songToPlay =
      this.playSongFromPlaylist(newSongs, options.songIdxToPlay, options.songIdToPlay);

    if (songToPlay) {
      player = {
        title: songToPlay.name,
        subtitle: songToPlay.desc,
        imgUrl: songToPlay.imgUrl
      };
    }

    this.setState({
      ...this.state,
      isPlaying: !!songToPlay,
      rightSection: { items: newSongs },
      player
    });
  }

  handleMiddleSectionItemDblClick(item: ListItemProps) {
    const song = allSongs.find(el => el.id === item.id)!;
    const songs = this.state.middleSection.items
      .map(el => allSongs.find(el2 => el2.id === el.id)!);

    this.setPlayingPlaylist(songs, {
      songIdToPlay: song.id
    });
  }

  handleSidebarSectItemDblClick(section: string, item: string) {
    if (section === 'library' && item === 'allsongs') {
      this.setState({
        ...this.state,
        middleSection: { title: 'All Songs', items: allSongs }
      });
    }

    this.setPlayingPlaylist(allSongs, { songIdxToPlay: 0 });
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
        />
      </div>
    );
  }
}
