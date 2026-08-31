import Link from "next/link";

const points = [
  {
    title: "Issued as a digital QR code",
    body: "Egypt's Visa-on-Arrival is now issued as a digital QR code rather than a paper sticker placed in your passport.",
  },
  {
    title: "Generated before you travel",
    body: "The QR code is generated ahead of your journey, so it is ready before you reach the airport.",
  },
  {
    title: "Valid for 48 hours",
    body: "The QR code is valid for 48 hours from the moment it is generated, which makes timing it against your flight important.",
  },
  {
    title: "Cairo Airport for now",
    body: "The QR code system currently applies at Cairo International Airport. Other Egyptian airports are expected to follow.",
  },
];

export default function QRVisaNotice() {
  return (
    <section className="bg-ivory py-20">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
            What&rsquo;s new
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-emerald-dark sm:text-3xl">
            Egypt now issues the visa as a digital QR code
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink/65">
            Here is what that means in practice for your arrival.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {points.map((p) => (
            <div key={p.title} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <h3 className="font-display text-base font-semibold text-emerald-dark">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{p.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-ink/50">
          Requirements can change at short notice.{" "}
          <Link
            href="/blog/egypt-digital-qr-code-visa-cairo-airport"
            className="font-semibold text-emerald underline"
          >
            Read the full update
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="font-semibold text-emerald underline">
            contact our team
          </Link>{" "}
          to confirm what currently applies to your nationality and route.
        </p>
      </div>
    </section>
  );
}
