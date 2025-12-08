"use client";

import { MDXProvider } from "@mdx-js/react";
import { type ReactNode } from "react";

// Custom components for MDX
const components = {
  h1: (props: any) => (
    <h1 className="text-4xl font-bold mb-6 text-gray-900" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-3xl font-semibold mb-4 mt-8 text-gray-800" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-2xl font-medium mb-3 mt-6 text-gray-700" {...props} />
  ),
  h4: (props: any) => (
    <h4 className="text-xl font-medium mb-2 mt-4 text-gray-600" {...props} />
  ),
  p: (props: any) => (
    <p className="mb-4 text-gray-600 leading-relaxed" {...props} />
  ),
  ul: (props: any) => (
    <ul className="mb-4 ml-6 list-disc text-gray-600" {...props} />
  ),
  ol: (props: any) => (
    <ol className="mb-4 ml-6 list-decimal text-gray-600" {...props} />
  ),
  li: (props: any) => <li className="mb-2" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-700"
      {...props}
    />
  ),
  code: (props: any) => (
    <code
      className="bg-gray-100 px-2 py-1 rounded text-sm font-mono"
      {...props}
    />
  ),
  pre: (props: any) => (
    <pre
      className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"
      {...props}
    />
  ),
  a: (props: any) => (
    <a className="text-blue-600 hover:text-blue-800 underline" {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-4">
      <table
        className="min-w-full border-collapse border border-gray-300"
        {...props}
      />
    </div>
  ),
  th: (props: any) => (
    <th
      className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left"
      {...props}
    />
  ),
  td: (props: any) => (
    <td className="border border-gray-300 px-4 py-2" {...props} />
  ),
};

interface MDXProviderWrapperProps {
  children: ReactNode;
}

export function MDXProviderWrapper({ children }: MDXProviderWrapperProps) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
