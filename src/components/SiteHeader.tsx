import Link from 'next/link'

/**
 * Cabeçalho simples para páginas secundárias (/news, /admin). A home usa o TopBar
 * próprio com âncoras de scroll; aqui são rotas reais, então um header leve basta.
 */
export function SiteHeader({ right }: { right?: React.ReactNode }) {
  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-xl"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-black tracking-tight">
          BEST CARS <span className="text-gradient">EVER</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/news" className="text-platinum/80 transition-colors hover:text-platinum">
            Notícias
          </Link>
          {right}
        </nav>
      </div>
    </header>
  )
}
