import path from 'node:path';

export function getConfigPath() {
  return process.env.NODE_ENV === 'prod'
    ? path.resolve(process.cwd(), '..', 'config', '.env.production.local')
    : path.resolve(process.cwd(), 'config', '.env.development.local');
}
