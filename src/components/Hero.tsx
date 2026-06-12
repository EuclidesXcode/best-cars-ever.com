'use client'

import { useTranslation } from 'react-i18next'
import Image from 'next/image'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-black to-slate-900"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo/Icon */}
        <div className="mb-8 relative w-24 h-24 mx-auto">
          <Image
            src="/icons/car.svg"
            alt={t('hero.iconAlt')}
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
          {t('hero.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          {t('hero.subtitle')}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
              50+
            </div>
            <div className="text-gray-400 mt-2">{t('hero.stat1')}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
              8K+
            </div>
            <div className="text-gray-400 mt-2">{t('hero.stat2')}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
              1M+
            </div>
            <div className="text-gray-400 mt-2">{t('hero.stat3')}</div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-yellow-600 text-white font-semibold rounded-full hover:from-red-700 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-red-500/25">
            {t('hero.exploreButton')}
          </button>
          <button className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-full border border-white/10 hover:bg-slate-700 transition-all">
            {t('hero.aboutButton')}
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
