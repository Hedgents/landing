import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Long-form reading styles for the blog. No @tailwindcss/typography
// (incompatible with Tailwind v4 here); explicit component map instead.
// Palette: navy foreground, gold accents, cream surface — mixes Tailwind
// classes with inline style={{ color: "var(--gold)" }} per house style.
const components: Components = {
  h1: ({ children }) => (
    <h1
      className="font-serif font-bold leading-tight mt-2 mb-6"
      style={{ color: "var(--foreground)", fontSize: "clamp(30px, 5vw, 44px)" }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      className="font-serif font-bold leading-snug mt-14 mb-4"
      style={{ color: "var(--foreground)", fontSize: "clamp(22px, 3.5vw, 30px)" }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      className="font-serif font-bold leading-snug mt-10 mb-3"
      style={{ color: "var(--foreground)", fontSize: "clamp(18px, 2.6vw, 22px)" }}
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p
      className="my-5 text-[17px] leading-[1.8]"
      style={{ color: "var(--foreground)" }}
    >
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold" style={{ color: "var(--gold)" }}>
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic" style={{ color: "var(--muted-foreground)" }}>
      {children}
    </em>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="underline underline-offset-2 transition-opacity hover:opacity-70"
      style={{ color: "var(--gold)" }}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul
      className="my-5 list-disc space-y-2 pl-6 text-[17px] leading-[1.8]"
      style={{ color: "var(--foreground)" }}
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol
      className="my-5 list-decimal space-y-2 pl-6 text-[17px] leading-[1.8]"
      style={{ color: "var(--foreground)" }}
    >
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote
      className="my-6 border-l-2 pl-5 italic"
      style={{
        borderColor: "var(--gold)",
        color: "var(--muted-foreground)",
      }}
    >
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr
      className="my-10 border-0 h-px"
      style={{ backgroundColor: "var(--border)" }}
    />
  ),
  // Tables: scroll-wrap for narrow viewports, navy/cream bordered cells.
  table: ({ children }) => (
    <div className="my-8 w-full overflow-x-auto">
      <table
        className="w-full border-collapse text-sm"
        style={{ borderColor: "var(--border)" }}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ backgroundColor: "var(--navy)" }}>{children}</thead>
  ),
  th: ({ children }) => (
    <th
      className="border px-3 py-2 text-left font-mono text-xs font-semibold uppercase tracking-wide"
      style={{ borderColor: "var(--border)", color: "var(--card)" }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td
      className="border px-3 py-2 align-top leading-relaxed"
      style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
    >
      {children}
    </td>
  ),
  code: ({ children }) => (
    <code
      className="rounded px-1.5 py-0.5 font-mono text-[0.85em]"
      style={{
        backgroundColor: "var(--secondary)",
        color: "var(--foreground)",
      }}
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre
      className="my-6 overflow-x-auto rounded-md p-4 font-mono text-sm"
      style={{ backgroundColor: "var(--navy)", color: "var(--card)" }}
    >
      {children}
    </pre>
  ),
};

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
