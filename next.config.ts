import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aifiukfupjwlkbvebqgg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'www.zellige-maroc.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.terredezellige.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.zelligebladi.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zelligebladi.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
