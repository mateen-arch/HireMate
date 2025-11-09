/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GROK_API_KEY: process.env.GROK_API_KEY,
    GROK_API_URL: process.env.GROK_API_URL,
    ASSEMBLYAI_API_KEY: process.env.ASSEMBLYAI_API_KEY,
    ASSEMBLYAI_API_URL: process.env.ASSEMBLYAI_API_URL,
    JSONBIN_API_KEY: process.env.JSONBIN_API_KEY,
  },
}

module.exports = nextConfig
