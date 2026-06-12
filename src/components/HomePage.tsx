'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { carData } from '@/lib/carsData'
import CarCard from './CarCard'

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...new Set(carData.map((car) => car.category)) as string[]]

  const filteredCars = selectedCategory === 'all' 
    ? carData 
    : carData.filter((car) => car.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6624d76c3a?q=80&w=1920&auto=format&fit=crop"
            alt="Hero Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            Best Cars Ever
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Descubra as supercars e hypercars mais impressionantes do mundo
          </p>
          <Link 
            href="/contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-yellow-600 text-white font-bold rounded-full hover:from-red-700 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Entre em Contato
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-red-600 to-yellow-600 text-white shadow-lg transform scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <CarCard key={car.year + car.make + car.model} car={car} />
          ))}
        </div>

        {/* Footer within main */}
        <footer className="mt-20 text-center text-slate-500">
          <p>&copy; 2024 Best Cars Ever. Todos os direitos reservados.</p>
        </footer>
      </main>
    </div>
  )
}
