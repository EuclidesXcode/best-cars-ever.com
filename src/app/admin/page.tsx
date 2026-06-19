import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, Pencil } from 'lucide-react'
import { isCurrentUserAdmin, getAllPostsForAdmin } from '@/lib/queries'
import { SiteHeader } from '@/components/SiteHeader'

export const dynamic = 'force-dynamic'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default async function AdminPage() {
  // Proteção real no servidor: quem não for admin (ou nem estiver logado) é mandado embora.
  if (!(await isCurrentUserAdmin())) redirect('/')

  const posts = await getAllPostsForAdmin()

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-4xl font-bold text-platinum">Notícias</h1>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-gold px-4 py-2 text-sm font-semibold text-black transition-transform active:scale-95"
          >
            <Plus size={16} /> Novo post
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-platinum/60">Nenhum post ainda. Crie o primeiro.</p>
        ) : (
          <ul className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
            {posts.map((post) => (
              <li key={post.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-platinum">{post.title}</span>
                    {post.published ? (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                        Publicado
                      </span>
                    ) : (
                      <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs text-gold">
                        Rascunho
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-platinum/50">
                    /{post.slug} · {formatDate(post.created_at)}
                  </span>
                </div>
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
                >
                  <Pencil size={14} /> Editar
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
