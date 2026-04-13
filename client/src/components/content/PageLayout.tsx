import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-sidebar-border bg-sidebar">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/templates" className="text-xl font-bold text-primary">
            FreeGridPaper
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <Link href="/templates" className="text-foreground hover:text-primary">Templates</Link>
            <Link href="/category/graph-and-grid-paper" className="text-foreground hover:text-primary">Grid Paper</Link>
            <Link href="/category/writing-and-handwriting-paper" className="text-foreground hover:text-primary">Writing Paper</Link>
            <Link href="/faq" className="text-foreground hover:text-primary">FAQ</Link>
            <Link href="/graph">
              <Button size="sm">Open Generator</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>
      <footer className="border-t border-sidebar-border bg-sidebar py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/templates" className="text-primary hover:underline">Templates</Link>
          <Link href="/about" className="text-primary hover:underline">About</Link>
          <Link href="/contact" className="text-primary hover:underline">Contact</Link>
          <Link href="/privacy" className="text-primary hover:underline">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
