export interface Car {
  year?: string
  make?: string
  model?: string
  image?: string
  name?: string
  manufacturer?: string
  speed?: string
  category?: string
  description?: string
}

export const carData: Car[] = [
  {
    year: '2024',
    make: 'Ferrari',
    model: 'LaFerrari',
    image: 'https://images.unsplash.com/photo-1592198084033-aade972a0cc2?q=80&w=800&auto=format&fit=crop',
    description: 'A supercar mais rápida da Ferrari, com motor V12 de 6.5 litros e 950 cv.'
  },
  {
    year: '2023',
    make: 'Lamborghini',
    model: 'Revuelto',
    image: 'https://images.unsplash.com/photo-1542282088-feee1dc87faf?q=80&w=800&auto=format&fit=crop',
    description: 'O sucessor do Aventador, com motor V12 híbrido de 1001 cv.'
  },
  {
    year: '2024',
    make: 'McLaren',
    model: 'Artura',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6624d76c3a?q=80&w=800&auto=format&fit=crop',
    description: 'Hypercar de série com motor V6 biturbo híbrido de 674 cv.'
  },
  {
    year: '2023',
    make: 'Porsche',
    model: '911 GT3 RS',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6624d76c3a?q=80&w=800&auto=format&fit=crop',
    description: 'A versão mais extrema do 911, com motor 4.0L flat-six de 525 cv.'
  },
  {
    year: '2024',
    make: 'Bugatti',
    model: 'La Voiture Noire',
    image: 'https://images.unsplash.com/photo-1621255808129-9c75b4a2b925?q=80&w=800&auto=format&fit=crop',
    description: 'Homemagem ao Bugatti Royale, com motor W16 de 1500 cv.'
  },
  {
    year: '2023',
    make: 'Aston Martin',
    model: 'Valkyrie',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69889?q=80&w=800&auto=format&fit=crop',
    description: 'Hypercar colaborativa com a Red Bull, motor V12 de 1.160 cv.'
  }
]
