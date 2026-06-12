'use client'

import { useTranslation } from 'react-i18next'

export default function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                {t('about.title')}
              </span>
            </h2>
            
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>{t('about.para1')}</p>
              <p>{t('about.para2')}</p>
              <p>{t('about.para3')}</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800 rounded-lg border border-white/10">
                <h3 className="font-bold text-red-500 mb-2">{t('about.passion.title')}</h3>
                <p className="text-sm text-gray-400">{t('about.passion.text')}</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg border border-white/10">
                <h3 className="font-bold text-yellow-500 mb-2">{t('about.community.title')}</h3>
                <p className="text-sm text-gray-400">{t('about.community.text')}</p>
              </div>
            </div>
          </div>

          {/* Right content - About image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-white/10">
              <img 
                src="/about.jpg" 
                alt={t('about.imageAlt')} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          </div>
        </div>

        {/* Timeline intro */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
            {t('about.timeline.title')}
          </h3>
          <p className="text-gray-400 max-w-3xl mx-auto">{t('about.timeline.text')}</p>
          
          <div className="mt-8 flex justify-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="w-3 h-3 bg-red-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
