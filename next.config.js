/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    // Allow pdfjs worker to be bundled
    config.resolve.alias["pdfjs-dist/build/pdf.worker.min.mjs"] =
      require.resolve("pdfjs-dist/build/pdf.worker.min.mjs");
    return config;
  },
};

module.exports = nextConfig;
