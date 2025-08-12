/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    // Silence optional Node-only deps pulled by walletconnect/pino in the browser
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'pino-pretty': false,
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
}

module.exports = nextConfig
