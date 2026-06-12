import { Car } from '../types';
import './home.css';

const cars: Car[] = [
  {
    year: '2024',
    make: 'Ferrari',
    model: 'SF90 Stradale',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69889?q=80&w=800&auto=format&fit=crop',
    price: '€500,000',
    speed: '340 km/h',
    description: 'O SF90 Stradale é o primeiro supercar híbrido da Ferrari. Com 986 cv combinados e aceleração de 0-100 km/h em 2.5 segundos, ele redefine o luxo esportivo.',
    category: 'Supercar'
  },
  {
    year: '2024',
    make: 'Lamborghini',
    model: 'Revuelto',
    image: 'https://images.unsplash.com/photo-1544636331-e2ac2dabd669?q=80&w=800&auto=format&fit=crop',
    price: '$600,000',
    speed: '355 km/h',
    description: 'O Revuelto substitui o Aventador e Huracán como o novo ícone da Lamborghini. Com 1.001 cv e design agressivo, ele é uma declaração de estilo e performance.',
    category: 'Supercar'
  },
  {
    year: '2024',
    make: 'McLaren',
    model: 'Artura',
    image: 'https://images.unsplash.com/photo-1580273119667-c435c6a3e9b0?q=80&w=800&auto=format&fit=crop',
    price: '$240,000',
    speed: '327 km/h',
    description: 'A Artura é o primeiro supercar híbrido da McLaren. Com 680 cv e design esculpido como uma única peça de fibra de carbono, ela combina elegância com performance.',
    category: 'Supercar'
  },
  {
    year: '2024',
    make: 'Rimac',
    model: 'Nevera',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=800&auto=format&fit=crop',
    price: '$2,400,000',
    speed: '412 km/h',
    description: 'A Nevera é a mais rápida supercar do mundo. Com 1.914 cv e aceleração de 0-100 km/h em 1.7 segundos, ela é uma obra-prima da engenharia elétrica.',
    category: 'Hypercar'
  },
  {
    year: '2024',
    make: 'Porsche',
    model: '911 GT3 RS',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6624d76c3a?q=80&w=800&auto=format&fit=crop',
    price: '$260,000',
    speed: '330 km/h',
    description: 'O 911 GT3 RS é o carro de pista definitivo para o dia a dia. Com aerodinâmica extrema e motor de 502 cv, ele traz a experiência de corrida para a estrada.',
    category: 'Supercar'
  },
  {
    year: '2024',
    make: 'Aston Martin',
    model: 'Valhalla',
    image: 'https://images.unsplash.com/photo-1566008885218-90abf1838dfd?q=80&w=800&auto=format&fit=crop',
    price: '$1,450,000',
    speed: '340 km/h',
    description: 'O Valhalla é o supercar V6 híbrido da Aston Martin. Inspirado na Vantage GT2, ele oferece 1.078 cv e uma experiência de condução emocionante.',
    category: 'Supercar'
  },
  {
    year: '2024',
    make: 'Lotus',
    model: 'Emira V6',
    image: 'https://images.unsplash.com/photo-1494976388531-d1b5c4c3e0f8?q=80&w=800&auto=format&fit=crop',
    price: '$95,000',
    speed: '290 km/h',
    description: 'O Emira é o último carro esportivo com capota de tela da Lotus. Com design clássico e motor V6 turbo, ele homenageia a herança esportiva britânica.',
    category: 'Sports Car'
  }
];

export const homeData = {
  title: 'Melhores Carros do Mundo',
  subtitle: 'Explore nossa coleção exclusiva de supercars e hypercars',
  description: 'Descubra os carros mais impressionantes que já foram produzidos. Nossa seleção inclui desde clássicos lendários até as máquinas mais recentes e tecnológicas.',
  stats: [
    { label: 'Carros na Coleção', value: '7+' },
    { label: 'Marcas Representadas', value: '10+' },
    { label: 'Velocidade Máxima', value: '412 km/h' },
    { label: 'Potência Total', value: '1.914 cv' }
  ]
};