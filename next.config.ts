import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Configuración para manejar módulos ESM
    config.experiments = { ...config.experiments, topLevelAwait: true };
    
    // Asegurarse de que @react-pdf/renderer se maneje como ESM
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
  // Habilitar ESM externals
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
