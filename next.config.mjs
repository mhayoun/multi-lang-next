/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Move it here, outside of experimental
  allowedDevOrigins: ['192.168.150.139', 'localhost:3000'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;