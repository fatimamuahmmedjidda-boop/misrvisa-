"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Arrow, Check, Container, GoldButton, SectionHeader } from "@/components/site/ui";

const statuses = [
  { label: "Received", note: "Passport & ticket received" },
  { label: "Under review", note: "Documents checked by our Cairo team" },
  { label: "OK-to-Board approved", note: "Airline confirmation issued" },
  { label: "Ready to fly", note: "Pickup & hotel confirmed" },
];

const features = [
  ["Private tracking number", "Every application gets a MISR VISA tracking ID the moment you apply."],
  ["Live status, no calls", "Check progress any time on the Track page or in your traveler account."],
  ["WhatsApp updates", "Our team messages you at every milestone, in English or Arabic."],
  ["Partner dashboards", "Agencies see every referred traveler, status and commission in one place."],
];

export default function PhoneTracker() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateY = useTransform(scrollYProgress, [0.05, 0.4, 0.75, 1], [-72, 0, 0, 38]);
  const rotateX = useTransform(scrollYProgress, [0.05, 0.4, 0.75, 1], [22, 4, 4, -14]);
  const rotateZ = useTransform(scrollYProgress, [0.05, 0.4], [-10, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const [done, setDone] = useState(reduced ? 4 : 0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!reduced) setDone(Math.max(0, Math.min(4, Math.floor((v - 0.3) / 0.07))));
  });

  return (
    <section ref={ref} className="relative overflow-hidden py-28 sm:py-36">
      <div aria-hidden className="absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-emerald-glow/10 blur-[140px]" />
      <Container className="relative grid items-center gap-16 lg:grid-cols-2">
        <div className="perspective order-2 flex justify-center lg:order-1">
          <motion.div
            style={reduced ? undefined : { rotateY, rotateX, rotateZ, y }}
            className="preserve-3d relative h-[600px] w-[296px] rounded-[52px] bg-gradient-to-br from-[#2a2f2d] via-[#101413] to-[#2a2f2d] p-3 shadow-[0_80px_140px_-40px_rgba(0,0,0,0.95)] ring-1 ring-white/15"
          >
            {/* side buttons for depth */}
            <span aria-hidden className="absolute -left-[3px] top-28 h-12 w-[3px] rounded-l bg-[#3a403d]" />
            <span aria-hidden className="absolute -right-[3px] top-36 h-20 w-[3px] rounded-r bg-[#3a403d]" />
            <div className="relative h-full overflow-hidden rounded-[42px] bg-night-900">
              <div className="absolute left-1/2 top-3 z-10 h-7 w-24 -translate-x-1/2 rounded-full bg-black" />
              <div className="bg-gradient-to-b from-emerald to-emerald-dark px-5 pb-6 pt-14">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold/80">MISR VISA · Track</p>
                <p className="mt-2 font-display text-2xl text-ivory">MVR-2026-0142</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/30">
                  <motion.div className="h-full bg-gold-gradient" animate={{ width: `${(done / 4) * 100}%` }} transition={{ duration: 0.6 }} />
                </div>
                <p className="mt-2 text-[11px] text-ivory/60">{done >= 4 ? "Ready — see you in Cairo" : "Updated just now"}</p>
              </div>
              <ol className="space-y-1 p-4">
                {statuses.map((s, i) => {
                  const complete = i < done;
                  return (
                    <li key={s.label} className="flex gap-3 rounded-2xl p-3 transition-colors duration-500" style={{ background: complete ? "rgba(235,196,135,0.07)" : "transparent" }}>
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                          complete ? "border-gold bg-gold text-night-950" : "border-ivory/20 text-transparent"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className={`text-sm font-semibold transition-colors ${complete ? "text-ivory" : "text-ivory/40"}`}>{s.label}</p>
                        <p className="text-[11px] text-ivory/45">{s.note}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <div className="absolute inset-x-4 bottom-5 rounded-2xl bg-[#25D366]/15 p-3 text-[11px] text-ivory/80 ring-1 ring-[#25D366]/30">
                <span className="font-semibold text-[#5ee08f]">WhatsApp · MISR VISA</span>
                <br />
                {done >= 3 ? "Good news! Your OK-to-Board is approved ✈" : "We've received your passport. Reviewing now…"}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="order-1 lg:order-2">
          <SectionHeader
            align="left"
            eyebrow="Track like a flight"
            title={
              <>
                Every step, <span className="text-gold-gradient italic">in your pocket</span>.
              </>
            }
            lead="No chasing, no guessing. Follow your application from the moment we receive your passport to the moment you're cleared to fly."
          />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {features.map(([t, b]) => (
              <li key={t} className="border-l border-gold/30 pl-5">
                <h3 className="font-sans text-base font-semibold text-ivory">{t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ivory/55">{b}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <GoldButton href="/track">
              Track an application <Arrow />
            </GoldButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
