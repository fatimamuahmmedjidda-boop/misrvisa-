"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { blogPostSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";
import { Field, TextInput, TextArea } from "@/components/form/Field";

export interface BlogFormValues {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  author: string;
  seoTitle: string;
  metaDescription: string;
  published: boolean;
}

const empty: BlogFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  category: "Visa Updates",
  author: "MISR VISA Team",
  seoTitle: "",
  metaDescription: "",
  published: false,
};

export default function BlogForm({
  postId,
  initialValues,
}: {
  postId?: string;
  initialValues?: Partial<BlogFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<BlogFormValues>({ ...empty, ...initialValues });
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues?.slug));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
    setValues((v) => {
      const next = { ...v, [key]: value };
      if (key === "title" && !slugTouched) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = blogPostSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSaving(true);

    try {
      const res = await fetch(postId ? `/api/admin/blog/${postId}` : "/api/admin/blog", {
        method: postId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save post.");
        setSaving(false);
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Network error — please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Title" htmlFor="title" error={errors.title}>
          <TextInput id="title" value={values.title} onChange={(e) => update("title", e.target.value)} required />
        </Field>
        <Field label="Slug" htmlFor="slug" error={errors.slug}>
          <TextInput
            id="slug"
            value={values.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update("slug", slugify(e.target.value));
            }}
            required
          />
        </Field>
        <Field label="Category" htmlFor="category" error={errors.category}>
          <TextInput id="category" value={values.category} onChange={(e) => update("category", e.target.value)} required />
        </Field>
        <Field label="Author" htmlFor="author" error={errors.author}>
          <TextInput id="author" value={values.author} onChange={(e) => update("author", e.target.value)} />
        </Field>
        <Field label="Featured Image URL" htmlFor="featuredImage" optional error={errors.featuredImage}>
          <TextInput
            id="featuredImage"
            value={values.featuredImage}
            onChange={(e) => update("featuredImage", e.target.value)}
            placeholder="https://..."
          />
        </Field>
      </div>

      <Field label="Excerpt" htmlFor="excerpt" error={errors.excerpt}>
        <TextArea id="excerpt" rows={2} value={values.excerpt} onChange={(e) => update("excerpt", e.target.value)} required />
      </Field>

      <Field label="Content (HTML)" htmlFor="content" error={errors.content}>
        <TextArea
          id="content"
          rows={12}
          value={values.content}
          onChange={(e) => update("content", e.target.value)}
          placeholder="<p>Write your article using HTML tags (e.g. <p>, <h2>, <ul>).</p>"
          required
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="SEO Title" htmlFor="seoTitle" optional error={errors.seoTitle}>
          <TextInput id="seoTitle" value={values.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} />
        </Field>
        <Field label="Meta Description" htmlFor="metaDescription" optional error={errors.metaDescription}>
          <TextInput
            id="metaDescription"
            value={values.metaDescription}
            onChange={(e) => update("metaDescription", e.target.value)}
          />
        </Field>
      </div>

      <label className="flex items-center gap-2.5 text-sm font-medium text-emerald-dark">
        <input
          type="checkbox"
          checked={values.published}
          onChange={(e) => update("published", e.target.checked)}
          className="h-4 w-4 accent-emerald"
        />
        Published (visible on the public site)
      </label>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-emerald px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-emerald-dark disabled:opacity-60"
      >
        {saving ? "Saving..." : postId ? "Save Changes" : "Create Post"}
      </button>
    </form>
  );
}
