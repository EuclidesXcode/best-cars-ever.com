export interface Car {
  name: string
  year: string
  manufacturer: string
  image: string
  speed: number
  category: string
  description: string
}

export const carData: Car[] = [
  {
    name: 'Ferrari LaFerrari',
    year: '2013',
    manufacturer: 'Ferrari',
    image: '/images/ferrari-laferrari.jpg',
    speed: 352,
    category: 'Hypercar',
    description: 'A Ferrari LaFerrari é um hiperesportivo limitado a apenas 499 unidades, representando o ápice da engenharia italiana.'
  },
  {
    name: 'McLaren P1',
    year: '2015',
    manufacturer: 'McLaren',
    image: '/images/mclaren-p1.jpg',
    speed: 381,
    category: 'Hypercars',
    description: 'O McLaren P1 combina V8 turbo com motor elétrico, oferecendo uma experiência híbrida incomparável.'
  },
  {
    name: 'Bugatti Chiron',
    year: '2016',
    manufacturer: 'Bugatti',
    image: '/images/bugatti-chiron.jpg',
    speed: 420,
    category: 'Hypercar',
    description: 'O Bugatti Chiron redefine os limites da velocidade e luxo com sua motor W16 quad-turbo.'
  },
  {
    name: 'Koenigsegg Jesko',
    year: '2024',
    manufacturer: 'Koenigsegg',
    image: '/images/koenigsegg-jesko.jpg',
    speed: 531,
    category: 'Hypercar',
    description: 'O Koenigsegg Jesko é projetado para atingir velocidades extremas de até 531 km/h.'
  },
  {
    name: 'Porsche 918 Spyder',
    year: '2013',
    manufacturer: 'Porsche',
    image: '/images/porsche-918-spyder.jpg',
    speed: 350,
    category: 'Hypercars',
    description: 'O Porsche 918 Spyder é um híbrido de alta performance que combina elegância com potência.'
  },
  {
    name: 'Aston Martin Valkyrie',
    year: '2024',
    manufacturer: 'Aston Martin',
    image: '/images/aston-martin-valkyrie.jpg',
    speed: 448,
    category: 'Hypercar',
    description: 'O Aston Martin Valkyrie é um projeto colaborativo com a Red Bull Racing, focado em performance extrema.'
  }
]
