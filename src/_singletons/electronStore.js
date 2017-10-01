const path = require('path');
// eslint-disable-next-line
const electron = require('electron');
const dotProp = require('dot-prop');
const _ = require('lodash');
const fs = require('fs-extra');
// import * as path from 'path';
// import * as dotProp from 'dot-prop';
// import * as electron from 'electron';
// import * as fs from 'fs-extra';

let userDataPath = (electron.app || (electron.remote && electron.remote.app));
userDataPath = userDataPath && userDataPath.getPath('userData');

// function readJsonInUserDataDirSync(filename: string) {
function readJsonInUserDataDirSync(filename) {
  return fs.readJsonSync(path.resolve(userDataPath, filename));
}

// function outputJsonInUserDataDirSync(filename: string, data: any) {
function outputJsonInUserDataDirSync(filename, data) {
  fs.outputJsonSync(path.resolve(userDataPath, filename), data);
}

function removeFile(filename) {
  fs.removeSync(path.resolve(userDataPath, filename));
}

// export class ElectronStore {
class ElectronStore {
  constructor() {
    this.set = _.debounce(this.set, 300, { leading: false, trailing: true });
    this.delete = _.debounce(this.delete, 300, { leading: false, trailing: true });
  }
  // get(key: string, defaultValue?: any) {
  get(key, defaultValue) {
    return dotProp.get(this.store, key, defaultValue);
  }

  // set(key: string, value: any) {
  set(key, value) {
    const newStore = this.store;
    dotProp.set(newStore, key, value);
    this.store = newStore;
  }

  // delete(key: string) {
  delete(key) {
    const newStore = this.store;
    dotProp.delete(newStore, key);
    this.store = newStore;
  }

  deleteAll() {
    this.store = null;
  }

  getStore() {
    return this.store;
  }

  // private get store(): object {
  // eslint-disable-next-line
  get store() {
    try {
      return readJsonInUserDataDirSync('userPreferences.json');
    } catch (err) {
      return {};
    }
  }

  // private set store(value: object) {
  // eslint-disable-next-line
  set store(value) {
    try {
      if (value) {
        outputJsonInUserDataDirSync('userPreferences.json', value);
      } else {
        removeFile('userPreferences.json');
      }
    } catch (err) {
      // TODO: How to handle errors when saving data?
      console.log('Error setting store', err);
    }
  }
}

exports.VOLUME = 'volume';
exports.IS_REPEATED = 'isRepeated';
exports.IS_SHUFFLED = 'isShuffled';
exports.ROOT_PATH = 'rootPath';
exports.SIZE = 'size';
exports.POSITION = 'position';
exports.store = new ElectronStore();
