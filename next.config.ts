import type {NextConfig} from 'next';

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
      },
    ],
  },
};

export default nextConfig;
