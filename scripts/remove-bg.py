#!/usr/bin/env python3
"""Remove o fundo das fotos dos carros e padroniza num canvas transparente.

Lê os .jpg de public/cars/, gera <slug>.png (fundo transparente, carro
centralizado num quadro de proporção fixa). Idempotente.
"""
import os
import sys
from io import BytesIO

from PIL import Image
from rembg import remove, new_session

SRC_DIR = "public/cars"
# Proporção alvo do canvas (largura x altura). Carros são largos → 16:9.
CANVAS_W, CANVAS_H = 1600, 900
PAD = 0.06  # margem ao redor do carro (fração)


def fit_on_canvas(im: Image.Image) -> Image.Image:
    """Centraliza o recorte num canvas transparente de proporção fixa."""
    im = im.convert("RGBA")
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)  # tira o vazio transparente nas bordas

    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    max_w = int(CANVAS_W * (1 - 2 * PAD))
    max_h = int(CANVAS_H * (1 - 2 * PAD))
    scale = min(max_w / im.width, max_h / im.height)
    new_size = (max(1, int(im.width * scale)), max(1, int(im.height * scale)))
    im = im.resize(new_size, Image.LANCZOS)

    x = (CANVAS_W - im.width) // 2
    y = (CANVAS_H - im.height) // 2
    canvas.alpha_composite(im, (x, y))
    return canvas


def main():
    session = new_session("u2net")
    files = sorted(f for f in os.listdir(SRC_DIR) if f.endswith(".jpg"))
    for f in files:
        slug = f[:-4]
        out = os.path.join(SRC_DIR, slug + ".png")
        if os.path.exists(out):
            print(f"skip {slug} (já existe)")
            continue
        src = os.path.join(SRC_DIR, f)
        with open(src, "rb") as fh:
            data = fh.read()
        cut = remove(data, session=session)  # PNG bytes com alpha
        im = Image.open(BytesIO(cut))
        fit_on_canvas(im).save(out)
        print(f"ok   {slug}.png")


if __name__ == "__main__":
    sys.exit(main())
