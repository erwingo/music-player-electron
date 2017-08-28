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
- BUILD PROCESS BUGS
  - webpack-dev-server is running multiple times when saving 1 files. You can check by
    commenting everything in src/app/index.tsx and running webpack-dev-server
  - TS in webpack-dev-server is checking all the project even when im only watching 1 file
  - FIX: i had to killall node, apparently some webpack leaks are left behind
    when you cmd+q the electron app. Best solution is to split npm run dev tasks:
    npm run webpack-dev-server and NODE_ENV=development electron .
- prevent app from zooming in
- playing playlist should scroll when a song starts
- directory structure should start with main/renderer folders in src
- src and href should be relative and not absolute.
  - check index.html, index.bundle.js, index.bundle.css

# TODO
- menu item to select the directory root of media files
  - it should validate the structure of the folder
- if player is paused and u go to next/prev song, you should keep the player paused!
- shortcuts
  - space should pause
  - cmd + right/left should next/prev songs
  - cmd + up/down should increase/decrease volume
- fastforward/fastbackward songs!!!!!!!!
- debug main process
- arrow key navigation
- tests
- css modules
- take a look at this guy and check the e2e tests among other things they have
  https://github.com/chentsulin/electron-react-boilerplate
- use Redux
- use ts in index.ts (u can't for now)

# DONE
