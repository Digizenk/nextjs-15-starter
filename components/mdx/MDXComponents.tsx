import { Aside } from "@/components/mdx/Aside";
import { Callout } from "@/components/mdx/Callout";
import { MdxCard } from "@/components/mdx/MdxCard";
import React, { ReactNode } from "react";

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className: string;
  children: ReactNode;
}

const Heading: React.FC<HeadingProps> = ({ level, className, children }) => {
  const HeadingTag = `h${level}` as keyof React.ElementType;
  const headingId = children?.toString() ?? "";

  return React.createElement(
    HeadingTag,
    { id: headingId, className },
    children
  );
};

interface MDXComponentsProps {
  [key: string]: React.FC<any>;
}

const MDXComponents: MDXComponentsProps = {
  h1: (props) => (
    <Heading level={1} className="font-display text-4xl font-bold tracking-tight mt-10 mb-6" {...props} />
  ),
  h2: (props) => (
    <Heading
      level={2}
      className="font-display text-2xl font-semibold mt-10 mb-4"
      {...props}
    />
  ),
  h3: (props) => (
    <Heading
      level={3}
      className="font-display text-xl font-semibold mt-8 mb-3"
      {...props}
    />
  ),
  h4: (props) => (
    <Heading level={4} className="text-xl font-semibold mt-6 mb-4" {...props} />
  ),
  h5: (props) => (
    <Heading level={5} className="text-lg font-semibold mt-6 mb-4" {...props} />
  ),
  h6: (props) => (
    <Heading
      level={6}
      className="text-base font-semibold mt-6 mb-4"
      {...props}
    />
  ),
  hr: (props) => <hr className="border-t border-border my-8" {...props} />,
  p: (props) => (
    <p
      className="my-5 leading-relaxed text-foreground/90"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-primary font-medium underline underline-offset-4 hover:decoration-2"
      target="_blank"
      {...props}
    />
  ),
  ul: (props) => <ul className="list-disc pl-6 mt-0 mb-6" {...props} />,
  ol: (props) => <ol className="list-decimal pl-6 mt-0 mb-6" {...props} />,
  li: (props) => (
    <li className="mb-2 text-foreground/90" {...props} />
  ),
  code: (props) => (
    <code
      className="bg-muted rounded px-1.5 py-0.5 font-mono text-[0.9em]"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="rounded-lg p-4 overflow-x-auto my-4 bg-muted"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="pl-6 border-l-4 my-6 text-muted-foreground"
      {...props}
    />
  ),
  img: (props) => (
    <img className="rounded-lg border border-border my-6" {...props} />
  ),
  strong: (props) => <strong className="font-bold" {...props} />,
  table: (props) => (
    <div className="my-8 w-full overflow-x-auto">
      <table
        className="w-full shadow-sm rounded-lg overflow-hidden"
        {...props}
      />
    </div>
  ),
  tr: (props) => <tr className="border-t border-border" {...props} />,
  th: (props) => (
    <th
      className="px-6 py-3 font-bold text-left bg-muted [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="px-6 py-4 text-left border-t border-border [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  Aside,
  Callout,
  Card: MdxCard,
};

export default MDXComponents;
