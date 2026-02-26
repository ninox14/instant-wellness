import type { NextConfig } from 'next';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const nextConfig: NextConfig = {
  turbopack: {
    root: resolve(dirname(fileURLToPath(import.meta.url)), '..', '..'),
  },
};

export default nextConfig;
