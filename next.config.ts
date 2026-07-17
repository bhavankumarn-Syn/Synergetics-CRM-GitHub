import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
    
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },

    env: {
      NEXT_PUBLIC_BACKEND_API: "http://localhost:4000",
      // NEXT_PUBLIC_BACKEND_API: "https://contact-form-github-production.up.railway.app",
      NEXT_PUBLIC_TEST: "bhavan",
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "6LeDl0ctAAAAAC6gSMee3fRoFrBgZM43qYUmqGQw",
    },
  
};

export default nextConfig;
