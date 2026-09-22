import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { JournalPostForm } from "@/components/admin/JournalPostForm";
import { requireAdminPage } from "@/lib/admin/guard";
import { getJournalPost, listJournalEditorOptions } from "@/lib/admin/posts";
import { canManageBlog } from "@/lib/auth/permissions";
import { getDb } from "@/lib/db";
import { NotFoundError } from "@/lib/errors";

export const metadata: Metadata = {
  title: "Edit journal entry",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditBlogPage({ params }: PageProps) {
  const actor = await requireAdminPage("/admin/blog", canManageBlog);
  const { id } = await params;
  const db = getDb();

  let post;
  try {
    post = await getJournalPost(db, actor, id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  const options = await listJournalEditorOptions(db, actor);

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        eyebrow="Journal"
        title="Edit entry"
        description={`Slug ${post.slug}.`}
      />
      <div className="border-line bg-panel/60 mt-8 rounded-sm border p-5 md:p-8">
        <JournalPostForm
          mode="edit"
          postId={post.id}
          title={post.title}
          slug={post.slug}
          excerpt={post.excerpt}
          body={post.bodyText}
          status={post.status}
          seoTitle={post.seoTitle}
          seoDescription={post.seoDescription}
          canonicalUrl={post.canonicalUrl}
          categoryId={post.categoryId}
          tagNames={post.tagNames}
          featuredImageId={post.featuredImageId}
          ogImageId={post.ogImageId}
          featured={post.featured}
          publishedAt={post.publishedAt?.toISOString() ?? ""}
          categories={options.categories}
          images={options.images}
        />
      </div>
    </div>
  );
}
