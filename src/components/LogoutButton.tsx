"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({
  endpoint,
  redirectTo,
}: {
  endpoint: string;
  redirectTo: string;
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch(endpoint, { method: "POST" });
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink/60 transition-colors hover:border-emerald hover:text-emerald"
    >
      Sign out
    </button>
  );
}
