import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { isCurrentUserAdmin } from '@/lib/queries'
import { SiteHeader } from '@/components/SiteHeader'
import { PostForm } from '@/components/PostForm'

export const dynamic = 'force-dynamic'

export default async function NewPostPage() {
  if (!(await isCurrentUserAdmin())) redirect('/')

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm text-platinum/60 transition-colors hover:text-platinum"
        >
          <ArrowLeft size={16} /> Voltar
        </Link>
        <h1 className="mb-8 font-display text-4xl font-bold text-platinum">Novo post</h1>
        <PostForm />
      </main>
    </>
  )
}
