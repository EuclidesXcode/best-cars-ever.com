'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image
                src="/icons/car.svg"
                alt={t('navbar.logoAlt')}
                fill
                className="object-contain group-hover:scale-110 transition-transform"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
              BEST CARS EVER
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              {t('navbar.home')}
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              {t('navbar.about')}
            </Link>
            <Link href="/collection" className="text-gray-300 hover:text-white transition-colors">
              {t('navbar.collection')}
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
              {t('navbar.contact')}
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Language selector */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-gray-400 text-sm">{t('navbar.language')}</span>
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="en">🇺🇸 EN</option>
                <option value="pt">🇵🇹 PT</option>
                <option value="es">🇪🇸 ES</option>
                <option value="fr">🇫🇷 FR</option>
              </select>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
