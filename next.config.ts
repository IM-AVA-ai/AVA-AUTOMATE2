import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  } ,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      }
    ],
  },
  allowedDevOrigins: ['https://9007-idx-ava-automategit-1746338153443.cluster-ux5mmlia3zhhask7riihruxydo.cloudworkstations.dev'],
};

export default nextConfig;
