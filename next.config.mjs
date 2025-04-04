import TerserPlugin from "terser-webpack-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    workerThreads: true,
    cpus: 4, 
  },
  reactStrictMode: false,
  swcMinify: true,
  trailingSlash: false,
  images: {
    minimumCacheTTL: 43200,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://vin.dunghaysai.site/:path*", 
      },
    ];
  },
  productionBrowserSourceMaps: false,
  webpack(config, { isServer }) {
    if (!isServer) {
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: true,
            mangle: true,
          },
        })
      );
    }
    if (isServer) {
      config.resolve.alias["fs"] = false;
    }
    return config;
  },
};

export default nextConfig;
