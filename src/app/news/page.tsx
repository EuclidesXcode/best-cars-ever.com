import Link from 'next/link'
import type { Metadata } from 'next'
import { getPublishedPosts, isCurrentUserAdmin } from '@/lib/queries'
import { SiteHeader } from '@/components/SiteHeader'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Notícias — Best Cars Ever',
  description: 'Novidades, histórias e bastidores do mundo dos superesportivos.',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default async function NewsPage() {
  const [posts, admin] = await Promise.all([
    getPublishedPosts(),
    isCurrentUserAdmin(),
  ])

  return (
    <>
      <SiteHeader
        right={
          admin ? (
            <Link href="/admin" className="text-accent transition-colors hover:text-gold">
              Admin
            </Link>
          ) : null
        }
      />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Best Cars Ever</p>
          <h1 className="mt-2 font-display text-5xl font-bold text-platinum">Notícias</h1>
        </header>

        {posts.length === 0 ? (
          <p className="text-platinum/60">Nenhuma notícia publicada ainda.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-colors hover:border-white/25"
              >
                {post.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover_url}
                    alt={post.title}
                    className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="aspect-video w-full bg-gradient-to-br from-accent/20 to-gold/10" />
                )}
                <div className="p-5">
                  <time className="text-xs uppercase tracking-wide text-platinum/50">
                    {formatDate(post.created_at)}
                  </time>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-platinum">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-3 text-platinum/70">{post.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
