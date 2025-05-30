// const withPWA = require('next-pwa')({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development'
// });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {

    remotePatterns: [
      {
        protocol: 'https', // 프로토콜 지정 (http 또는 https)
        hostname: 'images.unsplash.com', // 허용할 호스트네임
        port: '', // 포트가 특정되어 있다면 지정 (예: '8080'), 없으면 빈 문자열
        pathname: '/**', // 해당 호스트네임의 모든 경로를 허용한다는 의미
                          // 특정 경로만 허용하려면 '/some/path/**' 와 같이 지정 가능
      },
      { // 개발 환경에서 사용하는 로컬 호스트
        protocol: 'http',
        hostname: 'localhost',
        port: '8080', 
        pathname: '/**', 
      },
    ],
  },
};

// module.exports = withPWA(nextConfig); 
module.exports = nextConfig; 