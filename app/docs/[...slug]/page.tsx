import { MDXRemote } from "next-mdx-remote/rsc";
import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";

// Define the props for the page component
interface DocsPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

// Function to get all MDX files from the docs directory
async function getMDXFiles() {
  const docsDirectory = path.join(process.cwd(), "docs");
  try {
    const files = await fs.readdir(docsDirectory);
    return files.filter((file) => file.endsWith(".mdx"));
  } catch {
    return [];
  }
}

// Function to read MDX content
async function getMDXContent(filename: string) {
  const filePath = path.join(process.cwd(), "docs", filename);
  try {
    const content = await fs.readFile(filePath, "utf8");
    return content;
  } catch {
    return null;
  }
}

// Generate static params for all MDX files
export async function generateStaticParams() {
  const files = await getMDXFiles();
  return files.map((file) => ({
    slug: [file.replace(".mdx", "")],
  }));
}

// Main page component
export default async function DocsPage({ params }: DocsPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.[0] || "index";
  const filename = `${slug}.mdx`;

  const content = await getMDXContent(filename);

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <MDXRemote source={content} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Metadata for SEO
export async function generateMetadata({ params }: DocsPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.[0] || "index";

  return {
    title: `Humanika Docs - ${
      slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ")
    }`,
    description:
      "Dokumentasi lengkap sistem manajemen organisasi mahasiswa Humanika",
  };
}
