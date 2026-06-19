import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getPostBySlug } from '@/lib/queries'
import { SiteHeader } from '@/components/SiteHeader'
import { Markdown } from '@/components/Markdown'

export const dynamic = 'force-dynamic'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return { title: 'Notícia não encontrada — Best Cars Ever' }
  return {
    title: `${post.title} — Best Cars Ever`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_url ? [post.cover_url] : undefined,
    },
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/news"
          className="mb-8 inline-flex items-center gap-2 text-sm text-platinum/60 transition-colors hover:text-platinum"
        >
          <ArrowLeft size={16} /> Notícias
        </Link>

        {!post.published && (
          <p className="mb-4 inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">
            Rascunho — visível apenas para você
          </p>
        )}

        <article>
          <header className="mb-8">
            <time className="text-sm uppercase tracking-wide text-platinum/50">
              {formatDate(post.created_at)}
            </time>
            <h1 className="mt-2 font-display text-4xl font-bold leading-tight text-platinum sm:text-5xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-4 text-xl text-platinum/70">{post.excerpt}</p>
            )}
          </header>

          {post.cover_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_url}
              alt={post.title}
              className="mb-10 w-full rounded-3xl object-cover"
            />
          )}

          <Markdown>{post.body}</Markdown>
        </article>
      </main>
    </>
  )
}
