import { Callout } from "@/components/mdx/Callout";
import MDXComponents from "@/components/mdx/MDXComponents";
import { Locale, LOCALES } from "@/i18n/routing";
import { getPosts } from "@/lib/getBlogs";
import { constructMetadata } from "@/lib/metadata";
import { BlogPost } from "@/types/blog";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { notFound } from "next/navigation";

type Params = Promise<{
  locale: string;
  slug: string;
}>;

type MetadataProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale, slug } = await params;
  let { posts }: { posts: BlogPost[] } = await getPosts(locale);
  const post = posts.find((post) => post.slug === "/" + slug);

  if (!post) {
    return constructMetadata({
      title: "404",
      description: "Page not found",
      noIndex: true,
      locale: locale as Locale,
      path: `/blog/${slug}`,
      canonicalUrl: `/blog/${slug}`,
    });
  }

  return constructMetadata({
    page: "blog",
    title: post.title,
    description: post.description,
    images: post.image ? [post.image] : [],
    locale: locale as Locale,
    path: `/blog/${slug}`,
    canonicalUrl: `/blog/${slug}`,
  });
}

export default async function BlogPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  let { posts }: { posts: BlogPost[] } = await getPosts(locale);

  const post = posts.find((item) => item.slug === "/" + slug);

  if (!post) {
    return notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-20 sm:px-6">
      <h1 className="mt-6 break-words font-display text-4xl font-bold tracking-tight sm:text-5xl">
        {post.title}
      </h1>
      {post.image && (
        <img src={post.image} alt="" className="mt-8 rounded-lg border border-border" />
      )}
      {post.tags && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {post.tags.split(",").map((tag) => (
            <li key={tag} className="rounded-md bg-muted px-2.5 py-1 text-sm text-muted-foreground">
              {tag.trim()}
            </li>
          ))}
        </ul>
      )}
      {post.description && <Callout>{post.description}</Callout>}
      <MDXRemote source={post?.content || ""} components={MDXComponents} />
    </div>
  );
}

export async function generateStaticParams() {
  const perLocale = await Promise.all(
    LOCALES.map(async (locale) => {
      const { posts } = await getPosts(locale);
      return posts
        .filter((post) => post.slug)
        .map((post) => ({ locale, slug: post.slug.replace(/^\//, "").replace(/^blog\//, "") }));
    })
  );
  return perLocale.flat();
}
