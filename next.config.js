const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  publicExcludes: ['!icons/**/*'],
  buildExcludes: [/chunks\/.*$/],
  fallbacks: {
    document: '/offline',
    image: '/static/images/fallback.png'
  }
})

module.exports = withPWA({
  // other Next.js config options here
  output: 'standalone',
}) 