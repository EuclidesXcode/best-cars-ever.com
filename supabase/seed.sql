-- ============================================================
-- Best Cars Ever — seed de carros
-- Rode DEPOIS do schema.sql. Idempotente (on conflict do nothing).
-- ============================================================

insert into public.cars (slug, name, manufacturer, year, decade, top_speed, power_hp, image_url, blurb) values
-- ---------------- 1970s ----------------
('lamborghini-countach-lp400', 'Countach LP400', 'Lamborghini', 1974, 1970, 315, 375,
 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1600&auto=format&fit=crop',
 '{"en":"The wedge that defined the supercar poster era — scissor doors and a screaming V12.","pt":"A cunha que definiu a era dos pôsteres de superesportivos — portas tesoura e um V12 enfurecido.","es":"La cuña que definió la era del póster del superdeportivo — puertas tijera y un V12 rugiente."}'),
('ferrari-512-bb', '512 BB', 'Ferrari', 1976, 1970, 302, 360,
 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1600&auto=format&fit=crop',
 '{"en":"Ferrari''s flat-12 Berlinetta Boxer, raw and analog perfection.","pt":"A Berlinetta Boxer de 12 cilindros opostos da Ferrari, perfeição crua e analógica.","es":"La Berlinetta Boxer de 12 cilindros opuestos de Ferrari, perfección cruda y analógica."}'),
('porsche-911-turbo-930', '911 Turbo (930)', 'Porsche', 1975, 1970, 250, 260,
 'https://images.unsplash.com/photo-1503376780353-7e6624d76c3a?q=80&w=1600&auto=format&fit=crop',
 '{"en":"The widow-maker. Turbo lag and glory in equal measure.","pt":"O fazedor de viúvas. Turbo lag e glória em medidas iguais.","es":"El hacedor de viudas. Turbo lag y gloria a partes iguales."}'),

-- ---------------- 1980s ----------------
('ferrari-f40', 'F40', 'Ferrari', 1987, 1980, 324, 471,
 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1600&auto=format&fit=crop',
 '{"en":"The last Ferrari signed off by Enzo himself. Twin-turbo, no frills, all soul.","pt":"A última Ferrari aprovada pelo próprio Enzo. Biturbo, sem luxos, pura alma.","es":"El último Ferrari aprobado por el propio Enzo. Biturbo, sin lujos, todo alma."}'),
('porsche-959', '959', 'Porsche', 1986, 1980, 317, 444,
 'https://images.unsplash.com/photo-1614026480209-cb9d81b0c40c?q=80&w=1600&auto=format&fit=crop',
 '{"en":"A technological moonshot — AWD, twin-turbo, computer-controlled everything.","pt":"Um salto tecnológico — tração integral, biturbo e controle eletrônico de tudo.","es":"Un salto tecnológico — tracción total, biturbo y control electrónico de todo."}'),
('lamborghini-countach-25th', 'Countach 25th', 'Lamborghini', 1988, 1980, 295, 455,
 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop',
 '{"en":"The final, most aggressive evolution of the icon.","pt":"A evolução final e mais agressiva do ícone.","es":"La evolución final y más agresiva del ícono."}'),

-- ---------------- 1990s ----------------
('mclaren-f1', 'F1', 'McLaren', 1992, 1990, 386, 627,
 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=1600&auto=format&fit=crop',
 '{"en":"Central driving seat, gold-lined engine bay, and a record that stood for years.","pt":"Banco de motorista central, cofre do motor revestido de ouro e um recorde que durou anos.","es":"Asiento central de conducción, vano motor revestido en oro y un récord que duró años."}'),
('jaguar-xj220', 'XJ220', 'Jaguar', 1992, 1990, 341, 542,
 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1600&auto=format&fit=crop',
 '{"en":"Britain''s fastest of its day, long and low and gorgeous.","pt":"A mais rápida da Grã-Bretanha em sua época, longa, baixa e linda.","es":"La más rápida de Gran Bretaña de su época, larga, baja y preciosa."}'),
('bugatti-eb110', 'EB110', 'Bugatti', 1991, 1990, 351, 553,
 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1600&auto=format&fit=crop',
 '{"en":"The quad-turbo V12 that revived the Bugatti name.","pt":"O V12 quad-turbo que ressuscitou o nome Bugatti.","es":"El V12 quad-turbo que revivió el nombre Bugatti."}'),

-- ---------------- 2000s ----------------
('ferrari-enzo', 'Enzo', 'Ferrari', 2002, 2000, 350, 651,
 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1600&auto=format&fit=crop',
 '{"en":"F1 tech for the road, named after the founder for a reason.","pt":"Tecnologia de F1 para a rua, batizada com o nome do fundador por um motivo.","es":"Tecnología de F1 para la calle, bautizada con el nombre del fundador por una razón."}'),
('bugatti-veyron', 'Veyron 16.4', 'Bugatti', 2005, 2000, 407, 1001,
 'https://images.unsplash.com/photo-1566024287286-457247b70310?q=80&w=1600&auto=format&fit=crop',
 '{"en":"1001 hp, W16, quad-turbo. The car that broke the 400 km/h barrier on a road car.","pt":"1001 cv, W16, quad-turbo. O carro que quebrou a barreira dos 400 km/h em um carro de rua.","es":"1001 cv, W16, quad-turbo. El coche que rompió la barrera de los 400 km/h en un coche de calle."}'),
('porsche-carrera-gt', 'Carrera GT', 'Porsche', 2004, 2000, 330, 612,
 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1600&auto=format&fit=crop',
 '{"en":"A naturally aspirated V10 and a manual gearbox — analog purity.","pt":"Um V10 aspirado e câmbio manual — pureza analógica.","es":"Un V10 atmosférico y caja manual — pureza analógica."}'),

-- ---------------- 2010s ----------------
('ferrari-laferrari', 'LaFerrari', 'Ferrari', 2013, 2010, 350, 949,
 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1600&auto=format&fit=crop',
 '{"en":"Ferrari''s first hybrid hypercar, limited to 499 cars.","pt":"O primeiro hiperesportivo híbrido da Ferrari, limitado a 499 unidades.","es":"El primer hiperdeportivo híbrido de Ferrari, limitado a 499 unidades."}'),
('mclaren-p1', 'P1', 'McLaren', 2013, 2010, 350, 903,
 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=1600&auto=format&fit=crop',
 '{"en":"Hybrid power and active aero in a track-honed missile.","pt":"Potência híbrida e aerodinâmica ativa em um míssil afinado para pista.","es":"Potencia híbrida y aerodinámica activa en un misil afinado para pista."}'),
('porsche-918-spyder', '918 Spyder', 'Porsche', 2014, 2010, 345, 887,
 'https://images.unsplash.com/photo-1614026480209-cb9d81b0c40c?q=80&w=1600&auto=format&fit=crop',
 '{"en":"The most usable of the hybrid holy trinity.","pt":"O mais utilizável da santíssima trindade híbrida.","es":"El más usable de la santísima trinidad híbrida."}'),

-- ---------------- 2020s ----------------
('bugatti-chiron-ss', 'Chiron Super Sport', 'Bugatti', 2021, 2020, 440, 1578,
 'https://images.unsplash.com/photo-1566024287286-457247b70310?q=80&w=1600&auto=format&fit=crop',
 '{"en":"1578 hp and a top speed that humbles physics.","pt":"1578 cv e uma velocidade máxima que humilha a física.","es":"1578 cv y una velocidad máxima que humilla a la física."}'),
('koenigsegg-jesko', 'Jesko Absolut', 'Koenigsegg', 2022, 2020, 531, 1600,
 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1600&auto=format&fit=crop',
 '{"en":"Engineered to be the fastest Koenigsegg ever, chasing 500+ km/h.","pt":"Projetado para ser o Koenigsegg mais rápido de todos, mirando 500+ km/h.","es":"Diseñado para ser el Koenigsegg más rápido de la historia, persiguiendo 500+ km/h."}'),
('aston-martin-valkyrie', 'Valkyrie', 'Aston Martin', 2021, 2020, 402, 1160,
 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1600&auto=format&fit=crop',
 '{"en":"An F1 car for the road, born with Red Bull Racing.","pt":"Um carro de F1 para a rua, nascido com a Red Bull Racing.","es":"Un coche de F1 para la calle, nacido con Red Bull Racing."}')
on conflict (slug) do nothing;
