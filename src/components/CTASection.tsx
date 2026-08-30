import Button from "@/components/Button";
import Reveal from "@/components/Reveal";

export default function CTASection({
  title = "Ready to plan your trip to Egypt?",
  description = "Tell us about your travel plans and our team will guide you through the next steps.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="bg-emerald">
      <div className="mx-auto max-w-5xl px-5 py-16 text-center lg:px-8">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
            {description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/apply" variant="gold">
              Apply Now
            </Button>
            <Button href="/contact" variant="secondary" className="!border-white/30 !bg-transparent !text-white hover:!bg-white/10">
              Contact Us
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
