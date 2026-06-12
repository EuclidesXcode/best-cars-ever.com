'use client'

import CarCard from '@/components/CarCard'
import { carData, Car } from '@/lib/carsData'

export default function FeaturedCars() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
          Nossos Destaques
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {carData.map((car, index) => (
            <CarCard key={index} {...car} />
          ))}
        </div>
      </div>
    </section>
  )
}
