/** @type {import('next').NextConfig} */
// const nextConfig = {}
// module.exports = nextConfig


module.exports = {
    reactStrictMode: false,
    // env 내용 추가
    env: {
      BASE_URL: process.env.BASE_URL,
    },
  };