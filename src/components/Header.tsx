'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { i18n } = useTranslation()
  const router = useRouter()

  const toggleLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
              BEST CARS EVER
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
              Sobre
            </Link>
            <Link href="#cars" className="text-gray-300 hover:text-white transition-colors">
              Carros
            </Link>
            <Link href="#timeline" className="text-gray-300 hover:text-white transition-colors">
              Cronologia
            </Link>
            
            <div className="flex items-center space-x-2 border-l border-gray-700 pl-4">
              <button
                onClick={() => toggleLanguage('en')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  i18n.language === 'en' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => toggleLanguage('pt')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  i18n.language === 'pt' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                PT
              </button>
            </div>
          </nav>

          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="#about" 
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sobre
              </Link>
              <Link 
                href="#cars" 
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Carros
              </Link>
              <Link 
                href="#timeline" 
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Cronologia
              </Link>
              
              <div className="flex items-center space-x-2 pt-4 border-t border-gray-700">
                <button
                  onClick={() => { toggleLanguage('en'); setIsOpen(false); }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    i18n.language === 'en' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => { toggleLanguage('pt'); setIsOpen(false); }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    i18n.language === 'pt' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  PT
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
