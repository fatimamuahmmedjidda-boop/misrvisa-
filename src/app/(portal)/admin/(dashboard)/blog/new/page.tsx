import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-emerald-dark">New Blog Post</h1>
      <div className="mt-6 max-w-3xl rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <BlogForm />
      </div>
    </div>
  );
}
