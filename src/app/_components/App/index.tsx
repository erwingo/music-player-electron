// TODO: Ideal to cherry pick only what you need, waiting for this tho
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/7896
// import * as shuffle from 'lodash/fp/shuffle';

import { ipcRenderer } from 'electron';
import * as _ from 'lodash';
import * as React from 'react';
import * as constantEvents from '../../../_constants/events';
import { defaults } from '../../../_constants/userPreferences';
import * as electronStore from '../../../_singletons/electronStore';
import { getAbsPathFromFilesRootPath, getJsonFromFile } from '../../_helpers';
import { getFilesRootPath } from '../../_singletons/main';
import * as types from '../../_types';
import { AudioCore } from '../AudioCore';
import { List, ListItemProps } from '../List';
import { Player } from '../Player';
import { ActiveEls as SidebarActiveEls, Sidebar } from '../Sidebar';
import './index.scss';

interface NewSong extends types.Song {
  title: string;
  desc: string;
  allCovers: string[];
  imgUrl?: string;
}

const artists: types.Artist[] =
  getJsonFromFile(getAbsPathFromFilesRootPath('_data/artists.json'));

const albums: types.Album[] =
  getJsonFromFile(getAbsPathFromFilesRootPath('_data/albums.json'));

const allSongs: NewSong[] =
  (getJsonFromFile(getAbsPathFromFilesRootPath('_data/songs.json')) as types.Song[])
    .map(song => {
      const allCovers = [...song.covers, ...song.albumCovers, ...song.artistCovers];
      const firstCover = allCovers[0] as (string | undefined);
      const artistName = _.find(artists, el => el.id === song.artistId)!.name;
      const album = _.find(albums, el => el.id === song.albumId);

      return {
        ...song,
        title: song.name,
        desc: album ? artistName + ' - ' + album.name : artistName,
        allCovers,
        imgUrl: firstCover ? getAbsPathFromFilesRootPath(firstCover) : undefined
      };
    });

interface State {
  volume: number;
  isRepeated: boolean;
  isShuffled: boolean;
  isPlaying: boolean;
  currentSongId?: string;
  sidebar: SidebarActiveEls;
  middleSection: {
    title: string;
    items: NewSong[]
  };
  rightSection: {
    items: NewSong[],
    rowToScroll?: number | string;
  };
  player: {
    title?: string;
    subtitle?: string;
    imgUrl?: string;
    currentTime?: number;
    duration?: number;
  };
}

function showNotification(title: string, subtitle: string, options = {
  silent: true
}) {
  const notificationOptions = { body: subtitle, silent: options.silent } as any;
  const _ = new Notification(title, notificationOptions);
}

export class App extends React.Component<any, State> {
  audioCoreEl = new AudioCore();

  constructor() {
    super();
    this.handleMiddleSectionItemDblClick = this.handleMiddleSectionItemDblClick.bind(this);
    this.handleDragCompleted = this.handleDragCompleted.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handlePlayOrPauseClick = this.handlePlayOrPauseClick.bind(this);
    this.handleSidebarSectItemClick = this.handleSidebarSectItemClick.bind(this);
    this.handleRightSectionItemDblClick = this.handleRightSectionItemDblClick.bind(this);
    this.handleSidebarSectItemDblClick = this.handleSidebarSectItemDblClick.bind(this);
    this.handleShuffleBtnClick = this.handleShuffleBtnClick.bind(this);
    this.handleRepeatBtnClick = this.handleRepeatBtnClick.bind(this);
    this.handleFastBackwardClick = this.handleFastBackwardClick.bind(this);
    this.handleFastForwardClick = this.handleFastForwardClick.bind(this);

    this.state = {
      isPlaying: false,
      volume: electronStore.store.get(electronStore.VOLUME, defaults.volume),
      isRepeated: electronStore.store.get(electronStore.IS_REPEATED, defaults.isRepeated),
      isShuffled: electronStore.store.get(electronStore.IS_SHUFFLED, defaults.isShuffled),
      sidebar: {},
      middleSection: { title: '', items: [] },
      rightSection: { items: [] },
      player: {}
    };

    this.audioCoreEl.onEnd = () => {
      const queue = this.state.rightSection.items;
      const newSongIdx = _.findIndex(queue, el => el.id === this.state.currentSongId) + 1;

      if (this.state.isRepeated || newSongIdx < queue.length) {
        this.playPreviousOrNextSong(true);
      } else {
        // TODO: Go to first song and pause
      }
    };

    this.audioCoreEl.onProgress = (time: number, duration: number) => {
      this.setState({
        ...this.state,
        player: {
          ...this.state.player,
          currentTime: time,
          duration: duration
        }
      });
    };

    ipcRenderer.addListener(constantEvents.MEDIA_NEXT_TRACK, () => {
      this.playPreviousOrNextSong(true);
    });

    ipcRenderer.addListener(constantEvents.MEDIA_PREV_TRACK, () => {
      this.playPreviousOrNextSong(false);
    });

    ipcRenderer.addListener(constantEvents.MEDIA_PLAY_PAUSE, () => {
      this.playOrPause();
    });
  }

  handleDragCompleted(value: number) {
    this.audioCoreEl.setCurrentTime(value);
  }

  handleVolumeChange(value: number) {
    this.audioCoreEl.setVolume(value);
    electronStore.store.set(electronStore.VOLUME, value);
    this.setState({ ...this.state, volume: value });
  }

  playOrPause() {
    const shouldPlay = !this.state.isPlaying;

    if (shouldPlay) {
      this.audioCoreEl.play();
    } else {
      this.audioCoreEl.pause();
    }

    this.setState({ ...this.state, isPlaying: shouldPlay });
  }

  handlePlayOrPauseClick() {
    this.playOrPause();
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
      songToPlay = _.find(newSongs, el => el.id === options.songIdToPlay);
    }

    let currentSongId = this.state.currentSongId;
    if (songToPlay) {
      const filePath = songToPlay.path + '/_file' + songToPlay.fileExtension;
      this.audioCoreEl.setSrc(getAbsPathFromFilesRootPath(filePath));
      this.audioCoreEl.play(0);
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
      rightSection: {
        rowToScroll: options.songIdToPlay || options.songIdxToPlay,
        items: newSongs
      },
      currentSongId,
      player,
      ...options.state
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
      sidebar: {
        ...this.state.sidebar,
        sectionHighlightedId: section,
        sectionItemHighlightedId: item
      },
      middleSection: { ...newMiddleSection }
    });
  }

  handleSidebarSectItemDblClick(section: string, item: string) {
    const items = allSongs;

    this.setPlayingPlaylist(items, {
      shuffle: this.state.isShuffled,
      songIdxToPlay: 0,
      state: {
        sidebar: {
          sectionSelectedId: section,
          sectionItemSelectedId: item
        }
      }
    });
  }

  handleMiddleSectionItemDblClick(item: ListItemProps) {
    const song = _.find(allSongs, el => el.id === item.id)!;
    const songs = this.state.middleSection.items
      .map(el => _.find(allSongs, el2 => el2.id === el.id)!);

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

  handleShuffleBtnClick() {
    const newIsShuffle = !this.state.isShuffled;
    electronStore.store.set(electronStore.IS_SHUFFLED, newIsShuffle);

    this.setPlayingPlaylist(
      newIsShuffle ? this.state.rightSection.items : this.state.middleSection.items,
      { shuffle: newIsShuffle, state: { isShuffled: newIsShuffle } }
    );
  }

  handleRepeatBtnClick() {
    const newIsRepeated = !this.state.isRepeated;
    electronStore.store.set(electronStore.IS_REPEATED, newIsRepeated);
    this.setState({ ...this.state, isRepeated: newIsRepeated });
  }

  handleFastBackwardClick() {
    this.playPreviousOrNextSong(false);
  }

  handleFastForwardClick() {
    this.playPreviousOrNextSong(true);
  }

  // TODO: Way to sort methods by functionality/names
  playPreviousOrNextSong(isNextSong: boolean) {
    const queue = this.state.rightSection.items;
    const currentSongIdx = _.findIndex(queue, el => el.id === this.state.currentSongId);

    if (currentSongIdx === -1) { return; }

    let songIdxToPlay = 0;
    if (isNextSong) {
      if (currentSongIdx < queue.length - 1) { songIdxToPlay = currentSongIdx + 1; }
    } else {
      if (currentSongIdx > 0) { songIdxToPlay = currentSongIdx - 1; }
    }

    // Only show notification when window is not focused
    if (!ipcRenderer.sendSync(constantEvents.SYNC_GET_WINDOW_FOCUS_STATUS)) {
      const song = queue[songIdxToPlay];
      showNotification(song.title, song.desc);
    }
    this.setPlayingPlaylist(queue, { songIdxToPlay });
  }

  render() {
    return (
      <div className='app'>
        <div className='app__draggablearea' />
        <Player
          className='app__player'
          volume={this.state.volume}
          onVolumeChange={this.handleVolumeChange}
          onPlayOrPauseClick={this.handlePlayOrPauseClick}
          onFastBackwardClick={this.handleFastBackwardClick}
          onFastForwardClick={this.handleFastForwardClick}
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
            onRepeatBtnClick: this.handleRepeatBtnClick ,
            onShuffleBtnClick: this.handleShuffleBtnClick
          }}
        />
        <Sidebar
          className='app__sidebar'
          onSectionItemClick={this.handleSidebarSectItemClick}
          onSectionItemDblClick={this.handleSidebarSectItemDblClick}
          activeEls={this.state.sidebar}
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
          itemSelected={this.state.currentSongId}
          onItemDoubleClick={this.handleMiddleSectionItemDblClick}
        />
        <List
          className='app__rightsection'
          title='Playing'
          items={this.state.rightSection.items}
          rowToScroll={this.state.rightSection.rowToScroll}
          itemSelected={this.state.currentSongId}
          onItemDoubleClick={this.handleRightSectionItemDblClick}
        />
      </div>
    );
  }
}
