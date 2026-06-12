/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // As fotos finais ficam locais em /public/cars (.png). Mantemos o Unsplash
    // liberado para não quebrar enquanto o banco ainda não foi migrado.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
  },
}

export default nextConfig
