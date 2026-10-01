import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Partner Sign In",
  robots: { index: false, follow: false },
};

export default function PartnerLoginPage() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-md px-5 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
            Partner Portal
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-emerald-dark">
            Partner Sign In
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">
            Track your referred clients and commission.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
          <AuthForm
            endpoint="/api/partner-portal/login"
            fallbackRedirect="/partner-portal"
            allowedRedirectPrefix="/partner-portal"
            submitLabel="Sign In"
          />
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          <Link href="/account/forgot" className="font-semibold text-emerald underline">
            Forgot your password?
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-ink/60">
          Want to become a partner?{" "}
          <Link href="/partner" className="font-semibold text-emerald underline">
            Apply here
          </Link>
        </p>
      </div>
    </section>
  );
}
