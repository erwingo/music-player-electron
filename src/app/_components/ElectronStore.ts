import * as dotProp from 'dot-prop';
import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';

const userDataPath =
  ((electron.app || electron.remote.app) as any).getPath('userData') as string;

function readJsonInUserDataDirSync(filename: string) {
  return fs.readJsonSync(path.resolve(userDataPath, filename));
}

function outputJsonInUserDataDirSync(filename: string, data: any) {
  fs.outputJsonSync(path.resolve(userDataPath, filename), data);
}

export class ElectronStore {
  get(key: string, defaultValue?: any) {
    return dotProp.get(this.store, key, defaultValue);
  }

  set(key: string, value: any) {
    const newStore = this.store;
    dotProp.set(newStore, key, value);
    this.store = newStore;
  }

  delete(key: string) {
    const newStore = this.store;
    dotProp.delete(newStore, key);
    this.store = newStore;
  }

  getStore() {
    return this.store;
  }

  private get store(): object {
    try {
      return readJsonInUserDataDirSync('userPreferences.json');
    } catch (err) {
      return {};
    }
  }

  private set store(value: object) {
    try {
      outputJsonInUserDataDirSync('userPreferences.json', value);
    } catch (err) {
      // TODO: How to handle errors when saving data?
      console.log('Error setting store', err);
    }
  }
}
