import { Link as I18nLink } from "@/i18n/routing";
import { BlogPost } from "@/types/blog";

/** One guide in a list: title, summary and date, no thumbnail required. */
export function BlogCard({ post, locale }: { post: BlogPost; locale: string }) {
  const date = new Date(post.date).toLocaleDateString(locale === "es" ? "es" : "en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group relative border-t border-border py-6">
      <h3 className="font-display text-xl font-semibold leading-snug tracking-tight">
        <I18nLink
          href={`/blog${post.slug}`}
          prefetch={false}
          className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-highlight group-hover:decoration-[3px] group-hover:underline-offset-4"
        >
          {post.title}
        </I18nLink>
      </h3>
      {post.description && (
        <p className="mt-2 line-clamp-2 leading-relaxed text-muted-foreground">{post.description}</p>
      )}
      <p className="mt-3 text-sm text-muted-foreground">
        <time dateTime={new Date(post.date).toISOString()}>{date}</time>
      </p>
    </article>
  );
}
