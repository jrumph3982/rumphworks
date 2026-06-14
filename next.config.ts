import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.rumphworks.com" }],
        destination: "https://rumphworks.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
