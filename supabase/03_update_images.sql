-- ============================================================
-- Best Cars Ever — aponta cada carro para a imagem local real
-- (PNGs com fundo removido em /public/cars/<slug>.png, servidos pelo Next).
-- Rode no SQL Editor depois de já ter os carros na tabela.
-- ============================================================

update public.cars set image_url = '/cars/' || slug || '.png';
