// TODO: Ideal to cherry pick only what you need, waiting for this tho
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/7896
// import * as shuffle from 'lodash/fp/shuffle';

import { ipcRenderer, remote } from 'electron';
import * as _ from 'lodash';
import * as path from 'path';
import * as React from 'react';
import * as constantEvents from '../../../_constants/events';
import { defaults } from '../../../_constants/userPreferences';
import * as electronStore from '../../../_singletons/electronStore';
import { getFilesRootPath } from '../../../_singletons/main';
import { isAValidFilesRootPath, setFilesRootPath } from '../../../_singletons/main';
import { getAbsPathFromFilesRootPath, getJsonFromFile } from '../../_helpers';
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

interface State {
  volume: number;
  isRepeated: boolean;
  isShuffled: boolean;
  isPlaying: boolean;
  artists: types.Artist[];
  albums: types.Album[];
  allSongs: NewSong[];
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

function getArtistsAlbumsAndAllSongs() {
  let artists: types.Artist[] = [];
  let albums: types.Album[] = [];
  let allSongs: NewSong[] = [];

  if (isAValidFilesRootPath()) {
    artists = getJsonFromFile(getAbsPathFromFilesRootPath('_data/artists.json'));
    albums = getJsonFromFile(getAbsPathFromFilesRootPath('_data/albums.json'));

    allSongs = (getJsonFromFile(getAbsPathFromFilesRootPath('_data/songs.json')) as types.Song[])
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
          imgUrl: firstCover ? 'file:' + getAbsPathFromFilesRootPath(firstCover) : undefined
        };
      });
    }

  return { artists, albums, allSongs };
}

export class App extends React.Component<any, State> {
  audioCoreEl = new AudioCore();

  constructor() {
    super();
    this.handleMiddleSectionItemDblClick = this.handleMiddleSectionItemDblClick.bind(this);
    this.handleItemContextMenu = this.handleItemContextMenu.bind(this);
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

    const { artists, albums, allSongs } = getArtistsAlbumsAndAllSongs();

    this.state = {
      isPlaying: false,
      volume: electronStore.store.get(electronStore.VOLUME, defaults.volume),
      artists,
      albums,
      allSongs,
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
        this.playPreviousOrNextSong(true, true);
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

    ipcRenderer.addListener(constantEvents.NEW_ROOT_PATH_SELECTED, (_: any, dirPath: string) => {
      setFilesRootPath(dirPath);
      const { albums, allSongs, artists } = getArtistsAlbumsAndAllSongs();
      this.setState({ ...this.state, albums, artists, allSongs });
    });

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
      startPlaying?: boolean,
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
      this.audioCoreEl.setSrc('file:' + getAbsPathFromFilesRootPath(filePath));
      currentSongId = songToPlay.id;
      player = {
        title: songToPlay.title,
        subtitle: songToPlay.desc,
        imgUrl: songToPlay.imgUrl
      };

      if (options.startPlaying) {
        this.audioCoreEl.play(0);
      }
    }

    this.setState({
      ...this.state,
      rightSection: {
        rowToScroll: options.songIdToPlay || options.songIdxToPlay,
        items: newSongs
      },
      currentSongId,
      player,
      ...options.state,
      isPlaying: options.startPlaying
    });
  }

  handleSidebarSectItemClick(section: string, item: string) {
    let newMiddleSection: { title: string; items: NewSong[] };

    if (section === 'library' && item === 'allsongs') {
      newMiddleSection = {
        title: 'All Songs',
        items: this.state.allSongs
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
    const items = this.state.allSongs;

    this.setPlayingPlaylist(items, {
      shuffle: this.state.isShuffled,
      startPlaying: true,
      songIdxToPlay: 0,
      state: {
        sidebar: {
          sectionSelectedId: section,
          sectionItemSelectedId: item
        }
      }
    });
  }

  handleItemContextMenu(item: ListItemProps) {
    const menu = new remote.Menu();

    const playlistSubmenu = new remote.Menu();
    playlistSubmenu.append(new remote.MenuItem({
      label: 'New Playlist'
    }));

    playlistSubmenu.append(new remote.MenuItem({ type: 'separator' }));

    ['Epic', 'Hype', 'LOL'].forEach(el => {
      playlistSubmenu.append(new remote.MenuItem({ label: el }));
    });

    const addToPlaylistItem = new remote.MenuItem({
      label: 'Add To Playlist',
      submenu: playlistSubmenu
    });

    menu.append(addToPlaylistItem);
    menu.popup(remote.getCurrentWindow());
  }

  handleMiddleSectionItemDblClick(item: ListItemProps) {
    const song = _.find(this.state.allSongs, el => el.id === item.id)!;
    const songs = this.state.middleSection.items
      .map(el => _.find(this.state.allSongs, el2 => el2.id === el.id)!);

    this.setPlayingPlaylist(songs, {
      shuffle: this.state.isShuffled,
      startPlaying: true,
      songIdToPlay: song.id
    });
  }

  handleRightSectionItemDblClick(item: ListItemProps) {
    this.setPlayingPlaylist(this.state.rightSection.items, {
      shuffle: false,
      startPlaying: true,
      songIdToPlay: item.id
    });
  }

  handleShuffleBtnClick() {
    const newIsShuffle = !this.state.isShuffled;
    electronStore.store.set(electronStore.IS_SHUFFLED, newIsShuffle);

    this.setPlayingPlaylist(
      newIsShuffle ? this.state.rightSection.items : this.state.middleSection.items,
      { shuffle: newIsShuffle, startPlaying: true, state: { isShuffled: newIsShuffle } }
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
  playPreviousOrNextSong(isNextSong: boolean, shouldPlay = !this.audioCoreEl.isPaused()) {
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
    this.setPlayingPlaylist(queue, { songIdxToPlay, startPlaying: shouldPlay });
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
            },
            {
              id: 'playlists',
              title: 'Playlists',
              items: []
            }
          ]}
        />
        <List
          className='app__middlesection'
          title={this.state.middleSection.title}
          items={this.state.middleSection.items}
          itemSelected={this.state.currentSongId}
          onItemDoubleClick={this.handleMiddleSectionItemDblClick}
          onItemContextMenu={this.handleItemContextMenu}
        />
        <List
          className='app__rightsection'
          title='Playing'
          items={this.state.rightSection.items}
          rowToScroll={this.state.rightSection.rowToScroll}
          itemSelected={this.state.currentSongId}
          onItemDoubleClick={this.handleRightSectionItemDblClick}
          onItemContextMenu={this.handleItemContextMenu}
        />
      </div>
    );
  }
}
