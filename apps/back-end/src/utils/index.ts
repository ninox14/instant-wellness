import path from 'node:path';
import fs from 'node:fs';

export function getConfigPath() {
  let configPath: string;
  if (process.env.NODE_ENV === 'prod') {
    configPath = path.resolve(process.cwd(), 'config', '.env.production.local');
  } else {
    configPath = path.resolve(
      process.cwd(),
      'config',
      '.env.development.local',
    );
  }

  if (fs.existsSync(configPath)) {
    return configPath;
  }

  configPath = path.resolve(process.cwd(), '.env');

  if (fs.existsSync(configPath)) {
    return configPath;
  } else {
    throw Error('Provide env config ');
  }
}
