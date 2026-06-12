'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'

export default function Footer() {
  const { t, i18n } = useTranslation()
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <footer className="bg-slate-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-3xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                BEST CARS
              </span>
            </Link>
            <p className="text-gray-400 max-w-md">
              {t('footer.description')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.home')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.subscribe')}</h3>
            <p className="text-gray-400 mb-4 text-sm">
              {t('footer.subscribeDescription')}
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Email"
                className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-red-500 flex-1"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-yellow-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-yellow-700 transition-all"
              >
                {t('footer.subscribeButton')}
              </button>
            </form>
          </div>
        </div>

        {/* Language selector */}
        <div className="mt-8 flex justify-center">
          <select 
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-red-500"
          >
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400">
            {t('footer.copyright')} © {new Date().getFullYear()} BEST CARS EVER. 
            {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  )
}
