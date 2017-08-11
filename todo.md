- toggling shuffle should shuffle/unshuffle the queue
- next/prev song
- borderless window
- minwidth/height window
- check if resizing the window fast you still see the white bg
- persistent storage of user settings
  - volume
  - repeat
  - shuffle
- media controls should work
- system notification on next/prev songs
- name Music Player
- icon
- menu
- generate .app file with dist folder
- persistent storage of window size/position

# TODO
- songs
  - conquest of paradise song is not working
  - caraluna at 1:55 skipped a fraction of the song
- shortcuts
  - space should pause
  - cmd + right/left should next/prev songs
  - cmd + up/down should increase/decrease volume
- playing playlist should scroll when a song finishes
- BUILD PROCESS BUGS
  - webpack-dev-server is running multiple times when saving 1 files. You can check by
    commenting everything in src/app/index.tsx and running webpack-dev-server
  - ts in webpack-dev-server is checking all the project even when im only watching 1 file
- debug main process
- arrow key navigation
- tests
- css modules
- take a look at this guy and check the e2e tests among other things they have
  https://github.com/chentsulin/electron-react-boilerplate
- use Redux
- use ts in index.ts (u can't for now)

# DONE
