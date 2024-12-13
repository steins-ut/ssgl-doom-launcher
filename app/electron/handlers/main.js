import { app, ipcMain } from 'electron';

import { getJSON } from '../utils/json';
import { walkWadDir } from '../utils/mods';

ipcMain.handle('main/checkupdate', async () => {
  try {
    let update = {
      available: false,
      download: null,
      version: null,
      date: null,
      prerelease: null,
      changelog: null
    };

    const res = await (
      await fetch(
        'https://api.github.com/repos/cermak-petr/ssgl-doom-launcher/releases'
      )
    ).json();

    if (res[0] && `v${app.getVersion()}` !== res[0].tag_name) {
      update = {
        available: true,
        download: res[0].html_url,
        version: res[0].tag_name,
        date: res[0].published_at,
        prerelease: res[0].prerelease,
        changelog: res[0].body
      };
    }

    return {
      error: null,
      data: update
    };
  } catch (e) {
    return {
      data: null,
      error: e.message
    };
  }
});

ipcMain.handle('main/init', async () => {
  try {
    const settings = await getJSON('settings');
    const sourceports = (await getJSON('sourceports')) || [];
    const packages = (await getJSON('packages')) || [];

    try {
      const walkedFiles = await walkWadDir(settings.modpath);
      return {
        error: null,
        data: {
          ...walkedFiles,
          sourceports: sourceports,
          settings: settings,
          packages: packages
        }
      };
    } catch (e) {
      console.log(e);
      return {
        data: null,
        error: e.message
      };
    }
  } catch (e) {
    console.log(e);
    return {
      data: null,
      error: e.message
    };
  }
});
