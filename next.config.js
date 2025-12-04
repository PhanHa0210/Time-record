/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tối ưu cho production
  compress: true,
  poweredByHeader: false,
  
  // Tối ưu images nếu có
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // Tối ưu bundle
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  
  // Tối ưu compiler
  swcMinify: true,
  
  // Headers cho performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

