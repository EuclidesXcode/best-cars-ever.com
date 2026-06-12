import Image from 'next/image'
import { Car } from '@/lib/carsData'

interface CarCardProps {
  car: Car
}

export default function CarCard({ car }: CarCardProps) {
  // Proteção contra objeto nulo ou indefinido
  if (!car) {
    return null
  }

  return (
    <div className="group bg-slate-800 rounded-xl overflow-hidden border border-white/10 hover:border-red-500/50 transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-64 w-full overflow-hidden">
        {car.image ? (
          <Image
            src={car.image}
            alt={car.name ?? 'Car image'}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-slate-700 flex items-center justify-center text-slate-300">
            No image available
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{car.name ?? 'Unknown Car'}</h3>
        <p className="text-slate-400 text-sm mb-4">
          {car.year ?? 'N/A'} - {car.manufacturer ?? 'Unknown Manufacturer'}
        </p>
        
        <p className="text-slate-300 text-sm mb-4 line-clamp-2">
          {car.description ?? 'No description available.'}
        </p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-yellow-400 font-bold text-lg">
            {car.speed ? `${car.speed} km/h` : 'N/A'}
          </span>
          <span className="bg-slate-700 text-white text-xs px-3 py-1 rounded-full">
            {car.category ?? 'General'}
          </span>
        </div>

        <button className="w-full py-2 bg-gradient-to-r from-red-600 to-yellow-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-yellow-700 transition-all transform hover:scale-105">
          View Details
        </button>
      </div>
    </div>
  )
}