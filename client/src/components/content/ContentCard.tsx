import { Link } from 'wouter';

interface ContentCardProps {
  href: string;
  title: string;
  description: string;
  image?: string;
}

export function ContentCard({ href, title, description, image }: ContentCardProps) {
  return (
    <Link href={href}>
      <a className="group block overflow-hidden rounded-lg border border-sidebar-border bg-sidebar-accent/45 hover:border-primary/70 transition-colors">
        {image && (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-36 w-full object-cover bg-background"
          />
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </a>
    </Link>
  );
}
