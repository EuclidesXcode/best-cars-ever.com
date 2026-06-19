import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * Renderiza Markdown das notícias. react-markdown NÃO interpreta HTML bruto por
 * padrão, então não há risco de XSS pelo conteúdo. Estilização manual com Tailwind
 * (o projeto não usa @tailwindcss/typography).
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-5 text-lg leading-relaxed text-platinum/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p) => <h1 className="mt-10 font-display text-4xl font-bold text-platinum" {...p} />,
          h2: (p) => <h2 className="mt-8 font-display text-3xl font-semibold text-platinum" {...p} />,
          h3: (p) => <h3 className="mt-6 text-2xl font-semibold text-platinum" {...p} />,
          p: (p) => <p className="leading-relaxed" {...p} />,
          a: (p) => <a className="text-accent underline underline-offset-2 hover:text-gold" {...p} />,
          ul: (p) => <ul className="list-disc space-y-2 pl-6" {...p} />,
          ol: (p) => <ol className="list-decimal space-y-2 pl-6" {...p} />,
          blockquote: (p) => (
            <blockquote className="border-l-4 border-accent/60 pl-4 italic text-platinum/70" {...p} />
          ),
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          img: (p) => <img className="my-6 w-full rounded-2xl" loading="lazy" {...p} />,
          code: (p) => (
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-base" {...p} />
          ),
          hr: () => <hr className="my-8 border-white/10" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
