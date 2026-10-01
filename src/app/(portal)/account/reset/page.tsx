import type { Metadata } from "next";
import Link from "next/link";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Choose a New Password",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({ searchParams }: PageProps<"/account/reset">) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <section className="py-20">
      <div className="mx-auto max-w-md px-5 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
            Account Help
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-emerald-dark">
            Choose a New Password
          </h1>
        </div>

        <div className="mt-10 rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="text-center">
              <p className="text-sm leading-relaxed text-ink/70">
                This page needs a reset link to work. Please open the link our team sent you, or
                request a new one.
              </p>
              <Link
                href="/account/forgot"
                className="mt-6 inline-block rounded-full bg-emerald px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-emerald-dark"
              >
                Request a Reset Link
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
