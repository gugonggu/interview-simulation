import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // 타입 에러가 있어도 production build를 계속 진행
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint 에러도 빌드 막지 않도록 (원하면)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
