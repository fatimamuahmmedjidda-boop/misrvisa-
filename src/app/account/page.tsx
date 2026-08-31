import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/customerAuth";
import { serviceName } from "@/lib/content/services";
import StatusProgress from "@/components/StatusProgress";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Your Applications",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const session = await getCustomerSession();
  if (!session) return null;

  const applications = await prisma.application.findMany({
    where: { customerId: session.customerId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
              Your Account
            </span>
            <h1 className="mt-2 font-display text-3xl font-semibold text-emerald-dark">
              Welcome back, {session.fullName.split(" ")[0]}
            </h1>
            <p className="mt-2 text-sm text-ink/60">{session.email}</p>
          </div>
          <LogoutButton endpoint="/api/account/logout" redirectTo="/account/login" />
        </div>

        {applications.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-emerald/20 bg-white p-10 text-center">
            <p className="text-sm text-ink/60">You don&rsquo;t have any applications yet.</p>
            <Link
              href="/apply"
              className="mt-5 inline-block rounded-full bg-emerald px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-emerald-dark"
            >
              Start an Application
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-5">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-display text-lg font-semibold tracking-wide text-emerald-dark">
                    {app.trackingId}
                  </p>
                  <p className="text-xs text-ink/50">
                    Submitted {app.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <p className="mt-1 text-sm text-ink/70">{serviceName(app.service)}</p>
                <div className="mt-5">
                  <StatusProgress status={app.status} />
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-sm text-ink/55">
          Questions about an application?{" "}
          <Link href="/contact" className="font-semibold text-emerald underline">
            Contact our team
          </Link>
        </p>
      </div>
    </section>
  );
}
