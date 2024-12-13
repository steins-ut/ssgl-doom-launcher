import { spawn } from 'child_process';
import { ipcMain, shell } from 'electron';
import fs from 'fs';
import { dirname, join } from 'path';

import { getJSON } from './json';

export const open = async what => {
  try {
    const settings = await getJSON('settings');
    switch (what) {
      case 'binary':
        spawn(settings.obligeBinary, [
          '--install',
          dirname(settings.obligeBinary)
        ]);
        break;
      default:
        shell.openPath(settings.obligeConfigPath).catch(console.error);
    }
    return {
      data: null,
      error: null
    };
  } catch (e) {
    return {
      data: null,
      error: e.message
    };
  }
};
export const getConfigs = async () => {
  try {
    const settings = await getJSON('settings');
    return fs
      .readdirSync(settings.obligeConfigPath)
      .filter(file => file.indexOf('.') !== 0 && file.slice(-4) === '.txt')
      .map(file => {
        return {
          label: file.split('.')[0],
          value: join(settings.obligeConfigPath, file)
        };
      });
  } catch (e) {
    console.log(e);
  }
};

export const build = async (config, pack) => {
  try {
    const settings = await getJSON('settings');
    let log = '';

    ipcMain.on('log', event => {
      event.returnValue = log;
    });

    return new Promise(resolve => {
      const GENERATED_WAD_PATH = join(
        settings.savepath,
        pack.datapath,
        'generated.wad'
      );
      const params = [
        '--install',
        dirname(settings.obligeBinary),
        '--batch',
        GENERATED_WAD_PATH,
        '--load',
        config
      ];

      const procObl = spawn(settings.obligeBinary, params);

      procObl.stdout.on('data', data => {
        log += data;
      });

      procObl.stderr.on('data', data => {
        log += data;
      });

      procObl.on('close', () => {
        ipcMain.removeAllListeners('log');
        if (log.match(/(error|fail)/gi)) {
          return resolve({
            data: null,
            error: log
          });
        } else {
          ipcMain.removeAllListeners('log');
          return resolve({
            data: {
              wad: {
                active: true,
                created: Date.now(),
                id: 'OBLIGE-GENERATED-IWAD-NO-ID',
                kind: 'WAD',
                lastdir: 'data',
                name: 'Oblige Generated xxx',
                path: GENERATED_WAD_PATH,
                size: '0 MB'
              },
              log: log
            },
            error: null
          });
        }
      });
    });
  } catch (e) {
    return {
      data: null,
      error: e.message
    };
  }
};
