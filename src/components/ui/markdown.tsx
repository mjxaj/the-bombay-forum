import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <ReactMarkdown
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        // Headings
        "prose-headings:scroll-mt-20 prose-headings:font-display prose-headings:font-bold lg:prose-headings:scroll-mt-[8.5rem]",
        "prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4",
        "prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4",
        "prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3",
        // Lead Paragraph
        "prose-lead:text-neutral-500 dark:prose-lead:text-neutral-400",
        // Links
        "prose-a:font-medium prose-a:text-primary hover:prose-a:text-primary/80",
        // Lists
        "prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6",
        "prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6",
        // Blockquotes
        "prose-blockquote:border-l-2 prose-blockquote:border-neutral-200 prose-blockquote:pl-4 prose-blockquote:italic",
        "dark:prose-blockquote:border-neutral-700",
        // Code blocks
        "prose-pre:rounded-lg prose-pre:bg-neutral-100 prose-pre:p-4",
        "dark:prose-pre:bg-neutral-900",
        // Inline code
        "prose-code:rounded prose-code:bg-neutral-100 prose-code:px-1 prose-code:py-0.5",
        "dark:prose-code:bg-neutral-900",
        // Horizontal rules
        "prose-hr:border-neutral-200 dark:prose-hr:border-neutral-800",
        // Tables
        "prose-table:my-6",
        "prose-thead:border-b prose-thead:border-neutral-200 dark:prose-thead:border-neutral-800",
        "prose-tr:border-b prose-tr:border-neutral-200 dark:prose-tr:border-neutral-800",
        "prose-th:px-4 prose-th:py-2 prose-th:text-left",
        "prose-td:px-4 prose-td:py-2",
        className
      )}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
    >
      {content}
    </ReactMarkdown>
  );
} 