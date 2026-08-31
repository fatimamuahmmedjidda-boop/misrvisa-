import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign In to Your Account",
  description: "Sign in to your MISR VISA account to view your tracking numbers and application status.",
  robots: { index: false, follow: false },
};

export default function CustomerLoginPage() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-md px-5 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
            Your Account
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-emerald-dark">Sign In</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">
            View your tracking numbers and application progress.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
          <AuthForm
            endpoint="/api/account/login"
            fallbackRedirect="/account"
            allowedRedirectPrefix="/account"
            submitLabel="Sign In"
          />
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          Applied but never set a password?{" "}
          <Link href="/account/register" className="font-semibold text-emerald underline">
            Set one up
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-ink/60">
          Haven&rsquo;t applied yet?{" "}
          <Link href="/apply" className="font-semibold text-emerald underline">
            Start an application
          </Link>
        </p>
      </div>
    </section>
  );
}
