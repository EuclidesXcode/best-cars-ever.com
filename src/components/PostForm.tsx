'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus, Trash2, Eye, EyeOff } from 'lucide-react'
import type { Post } from '@/lib/types'
import {
  createPost,
  updatePost,
  deletePost,
  uploadNewsImage,
} from '@/lib/admin-actions'
import { Markdown } from './Markdown'

const ERRORS: Record<string, string> = {
  NOT_AUTHENTICATED: 'Você precisa estar logado.',
  NOT_ADMIN: 'Você não tem permissão de administrador.',
  TITLE_REQUIRED: 'O título é obrigatório.',
  SLUG_REQUIRED: 'O slug é obrigatório.',
  SLUG_TAKEN: 'Já existe um post com esse slug.',
  NO_FILE: 'Selecione um arquivo de imagem.',
}
const msg = (e: string) => ERRORS[e] ?? e

export function PostForm({ post }: { post?: Post }) {
  const router = useRouter()
  const isEdit = !!post
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(false)

  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [coverUrl, setCoverUrl] = useState(post?.cover_url ?? '')
  const [body, setBody] = useState(post?.body ?? '')
  const [published, setPublished] = useState(post?.published ?? false)

  const bodyRef = useRef<HTMLTextAreaElement>(null)

  function buildFormData() {
    const fd = new FormData()
    fd.set('title', title)
    fd.set('slug', slug)
    fd.set('excerpt', excerpt)
    fd.set('cover_url', coverUrl)
    fd.set('body', body)
    fd.set('published', published ? 'true' : 'false')
    return fd
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = isEdit
        ? await updatePost(post!.id, buildFormData())
        : await createPost(buildFormData())
      if (!res.ok) {
        setError(msg(res.error))
        return
      }
      router.push('/admin')
      router.refresh()
    })
  }

  function handleDelete() {
    if (!post) return
    if (!confirm('Apagar este post? Esta ação não pode ser desfeita.')) return
    startTransition(async () => {
      const res = await deletePost(post.id)
      if (!res.ok) {
        setError(msg(res.error))
        return
      }
      router.push('/admin')
      router.refresh()
    })
  }

  async function upload(file: File, target: 'cover' | 'body') {
    setError(null)
    setUploading(true)
    const fd = new FormData()
    fd.set('file', file)
    const res = await uploadNewsImage(fd)
    setUploading(false)
    if (!res.ok) {
      setError(msg(res.error))
      return
    }
    if (target === 'cover') {
      setCoverUrl(res.url)
    } else {
      // Insere a imagem em Markdown na posição do cursor.
      const ta = bodyRef.current
      const md = `\n\n![imagem](${res.url})\n\n`
      if (ta) {
        const start = ta.selectionStart
        setBody((b) => b.slice(0, start) + md + b.slice(start))
      } else {
        setBody((b) => b + md)
      }
    }
  }

  const field =
    'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-platinum outline-none placeholder:text-platinum/40 focus:border-accent'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div>
        <label className="mb-1.5 block text-sm text-platinum/70">Título</label>
        <input
          className={field}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            // Sugere slug a partir do título só na criação e se ainda intocado.
            if (!isEdit && !slug) setSlug(e.target.value)
          }}
          placeholder="Título da notícia"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-platinum/70">
          Slug (URL) — deixe em branco para gerar do título
        </label>
        <input
          className={field}
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="ex: lancamento-do-novo-ferrari"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-platinum/70">Resumo (excerpt)</label>
        <textarea
          className={field}
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Resumo curto que aparece na listagem"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-platinum/70">Imagem de capa</label>
        <div className="flex items-center gap-3">
          <input
            className={field}
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="URL da capa (ou faça upload →)"
          />
          <label className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm transition-colors hover:bg-white/10">
            <ImagePlus size={16} />
            Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) upload(f, 'cover')
                e.target.value = ''
              }}
            />
          </label>
        </div>
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="" className="mt-3 max-h-48 rounded-xl object-cover" />
        )}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm text-platinum/70">Conteúdo (Markdown)</label>
          <div className="flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-platinum/70 hover:text-platinum">
              <ImagePlus size={15} />
              {uploading ? 'Enviando…' : 'Inserir imagem'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) upload(f, 'body')
                  e.target.value = ''
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => setPreview((p) => !p)}
              className="inline-flex items-center gap-1.5 text-sm text-platinum/70 hover:text-platinum"
            >
              {preview ? <EyeOff size={15} /> : <Eye size={15} />}
              {preview ? 'Editar' : 'Pré-visualizar'}
            </button>
          </div>
        </div>

        {preview ? (
          <div className="min-h-[16rem] rounded-xl border border-white/15 bg-white/5 px-4 py-3">
            <Markdown>{body || '_Nada para mostrar ainda._'}</Markdown>
          </div>
        ) : (
          <textarea
            ref={bodyRef}
            className={`${field} font-mono text-sm`}
            rows={16}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={'Escreva em Markdown.\n\n## Subtítulo\n\nTexto em **negrito**, listas, links e imagens.'}
          />
        )}
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-5 w-5 rounded border-white/20 bg-white/5"
        />
        <span className="text-platinum">
          Publicado{' '}
          <span className="text-sm text-platinum/50">
            (desmarcado = rascunho, visível só para você)
          </span>
        </span>
      </label>

      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gradient-to-r from-accent to-gold px-6 py-3 font-semibold text-black transition-transform active:scale-95 disabled:opacity-50"
        >
          {pending ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Criar post'}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-full border border-red-500/40 px-4 py-3 text-sm text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            <Trash2 size={16} /> Apagar
          </button>
        )}
      </div>
    </form>
  )
}
