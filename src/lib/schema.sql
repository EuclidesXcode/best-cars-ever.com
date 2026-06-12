-- Schema para reviews e ratings dos supercarros

-- Tabela de reviews (comentários)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id INTEGER NOT NULL REFERENCES cars(id),
  user_id TEXT NOT NULL,
  comment TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para evitar múltiplos reviews do mesmo usuário no mesmo carro
CREATE INDEX IF NOT EXISTS reviews_user_car_idx ON reviews (user_id, car_id);

-- Tabela de ratings globais por década (ranking)
CREATE TABLE IF NOT EXISTS decade_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decade INTEGER NOT NULL CHECK (decade IN (70, 80, 90, 2000, 2010, 2020)),
  car_id INTEGER NOT NULL REFERENCES cars(id),
  avg_rating DECIMAL(3, 2) NOT NULL,
  total_votes INTEGER DEFAULT 0,
  UNIQUE (decade, car_id)
);

-- Criar índice para consultas de ranking
CREATE INDEX IF NOT EXISTS decade_ratings_decade_idx ON decade_ratings (decade);
CREATE INDEX IF NOT EXISTS decade_ratings_avg_rating_idx ON decade_ratings (decade, avg_rating DESC);
