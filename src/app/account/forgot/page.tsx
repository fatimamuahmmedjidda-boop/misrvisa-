import type { Metadata } from "next";
import Link from "next/link";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Your Password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-md px-5 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
            Account Help
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-emerald-dark">
            Forgot Your Password?
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">
            Enter the email you signed up with and we&rsquo;ll send you a link to choose a new
            password. This works for both traveler and partner accounts.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
          <ForgotPasswordForm />
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          Remembered it?{" "}
          <Link href="/account/login" className="font-semibold text-emerald underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
