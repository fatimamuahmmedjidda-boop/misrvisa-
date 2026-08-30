"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface BlogListItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  createdAt: string;
}

export default function BlogList({ posts }: { posts: BlogListItem[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(posts);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function togglePublished(id: string, published: boolean) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published }),
      });
      if (res.ok) {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, published } : r)));
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRows((prev) => prev.filter((r) => r.id !== id));
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  if (rows.length === 0) {
    return <p className="px-6 py-10 text-center text-sm text-ink/50">No blog posts yet.</p>;
  }

  return (
    <div className="divide-y divide-black/5">
      {rows.map((post) => (
        <div key={post.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <p className="font-medium text-ink">{post.title}</p>
            <p className="text-xs text-ink/50">
              /{post.slug} &middot; {post.category}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={busyId === post.id}
              onClick={() => togglePublished(post.id, !post.published)}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                post.published ? "bg-emerald/10 text-emerald" : "bg-ivory text-ink/50"
              }`}
            >
              {post.published ? "Published" : "Draft"}
            </button>
            <Link href={`/admin/blog/${post.id}`} className="text-xs font-semibold text-emerald hover:underline">
              Edit
            </Link>
            <button
              type="button"
              disabled={busyId === post.id}
              onClick={() => deletePost(post.id)}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
