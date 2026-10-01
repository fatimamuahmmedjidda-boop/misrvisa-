import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Set Up Your Account Password",
  description: "Set a password on your MISR VISA account to track your applications online.",
  robots: { index: false, follow: false },
};

export default function CustomerRegisterPage() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-md px-5 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
            Your Account
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-emerald-dark">
            Set Your Password
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">
            Use the same email you applied with. Your applications will be linked automatically.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
          <AuthForm
            endpoint="/api/account/register"
            fallbackRedirect="/account"
            allowedRedirectPrefix="/account"
            submitLabel="Create Password"
          />
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have a password?{" "}
          <Link href="/account/login" className="font-semibold text-emerald underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
