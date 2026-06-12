export interface Car {
  year: string;
  make: string;
  model: string;
  image: string;
  price: string;
  speed: string;
  description: string;
  category: 'Supercar' | 'Hypercar' | 'Sports Car';
}

export interface AboutSectionProps {
  title: string;
  subtitle: string;
  description: string;
  facts: string[];
}

export interface HomeSectionProps {
  title: string;
  subtitle: string;
  description: string;
  stats: { label: string; value: string }[];
}