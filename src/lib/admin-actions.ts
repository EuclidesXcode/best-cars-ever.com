'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ActionResult = { ok: true } | { ok: false; error: string }
export type SaveResult =
  | { ok: true; slug: string }
  | { ok: false; error: string }
export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string }

/** Gera um slug url-safe a partir do título. */
function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** Confirma no servidor que o usuário logado é admin. Defesa real, não só na UI. */
async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { supabase, error: 'NOT_AUTHENTICATED' as const }

  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  if (data?.is_admin !== true) return { supabase, error: 'NOT_ADMIN' as const }

  return { supabase, user, error: null }
}

function readPostForm(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const explicitSlug = String(formData.get('slug') ?? '').trim()
  const excerpt = String(formData.get('excerpt') ?? '').trim()
  const cover_url = String(formData.get('cover_url') ?? '').trim()
  const body = String(formData.get('body') ?? '')
  const published = formData.get('published') === 'on' || formData.get('published') === 'true'
  return {
    title,
    slug: explicitSlug ? slugify(explicitSlug) : slugify(title),
    excerpt: excerpt || null,
    cover_url: cover_url || null,
    body,
    published,
  }
}

export async function createPost(formData: FormData): Promise<SaveResult> {
  const { supabase, user, error } = await requireAdmin()
  if (error) return { ok: false, error }

  const fields = readPostForm(formData)
  if (!fields.title) return { ok: false, error: 'TITLE_REQUIRED' }
  if (!fields.slug) return { ok: false, error: 'SLUG_REQUIRED' }

  const { error: dbError } = await supabase
    .from('posts')
    .insert({ ...fields, author_id: user!.id })

  if (dbError) {
    if (dbError.code === '23505') return { ok: false, error: 'SLUG_TAKEN' }
    return { ok: false, error: dbError.message }
  }

  revalidatePath('/news')
  revalidatePath('/admin')
  revalidatePath(`/news/${fields.slug}`)
  return { ok: true, slug: fields.slug }
}

export async function updatePost(id: string, formData: FormData): Promise<SaveResult> {
  const { supabase, error } = await requireAdmin()
  if (error) return { ok: false, error }

  const fields = readPostForm(formData)
  if (!fields.title) return { ok: false, error: 'TITLE_REQUIRED' }
  if (!fields.slug) return { ok: false, error: 'SLUG_REQUIRED' }

  const { error: dbError } = await supabase.from('posts').update(fields).eq('id', id)

  if (dbError) {
    if (dbError.code === '23505') return { ok: false, error: 'SLUG_TAKEN' }
    return { ok: false, error: dbError.message }
  }

  revalidatePath('/news')
  revalidatePath('/admin')
  revalidatePath(`/news/${fields.slug}`)
  return { ok: true, slug: fields.slug }
}

export async function deletePost(id: string): Promise<ActionResult> {
  const { supabase, error } = await requireAdmin()
  if (error) return { ok: false, error }

  const { error: dbError } = await supabase.from('posts').delete().eq('id', id)
  if (dbError) return { ok: false, error: dbError.message }

  revalidatePath('/news')
  revalidatePath('/admin')
  return { ok: true }
}

/** Sobe uma imagem para o bucket "news" e devolve a URL pública. */
export async function uploadNewsImage(formData: FormData): Promise<UploadResult> {
  const { supabase, error } = await requireAdmin()
  if (error) return { ok: false, error }

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'NO_FILE' }
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error: upErr } = await supabase.storage
    .from('news')
    .upload(path, file, { contentType: file.type || undefined, upsert: false })
  if (upErr) return { ok: false, error: upErr.message }

  const { data } = supabase.storage.from('news').getPublicUrl(path)
  return { ok: true, url: data.publicUrl }
}
