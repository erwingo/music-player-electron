// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import * as path from 'path';
import * as React from 'react';
import * as reactDOM from 'react-dom';
import { App } from './_components/App';
import './_css/index.scss';
import './_fonts/icons/font';

reactDOM.render(
  <App />,
  document.getElementById('app')
);
