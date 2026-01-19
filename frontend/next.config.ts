import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Produção
      {
        protocol: "https",
        hostname: "www.iraquitantunoda.com.br",
      },
      {
        protocol: "https",
        hostname: "iraquitantunoda.com.br",
      },
      // Staging/Homologação
      {
        protocol: "http",
        hostname: "hml-tunoda.sp1.br.saveincloud.net.br",
        port: "8080",
      },
      // Local (backend local)
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8080",
      },
      // Domínios externos comuns para fotos (caso o backend use URLs externas)
      {
        protocol: "https",
        hostname: "*.amazonaws.com", // S3 buckets
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com", // Google Cloud Storage
      },
      // URLs de exemplo/teste (desenvolvimento)
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
};

export default nextConfig;
