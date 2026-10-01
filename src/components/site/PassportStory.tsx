"use client";

import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { JOURNEY_STEPS } from "@/lib/content/site";
import { Eyebrow } from "@/components/site/ui";
import { QrPattern } from "@/components/site/motion";

export default function PassportStory() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const done = useMotionValue(1);
  const p = reduced ? done : scrollYProgress;
  const [step, setStep] = useState(reduced ? 3 : 0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!reduced) setStep(Math.min(3, Math.floor(v * 4.05)));
  });

  return (
    <section ref={ref} id="journey" className={`relative ${reduced ? "" : "h-[420vh]"}`} aria-labelledby="journey-title">
      <div className={`${reduced ? "py-24" : "sticky top-0 h-[100svh] pt-20"} flex items-center overflow-hidden`}>
        <div aria-hidden className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-6 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          {/* Captions */}
          <div className="relative z-10 min-w-0">
            <Eyebrow>Your journey in 4 steps</Eyebrow>
            <h2 id="journey-title" className="mt-3 text-2xl font-medium leading-tight text-ivory sm:text-4xl 2xl:text-5xl">
              From your passport to <span className="text-gold-gradient italic">Cairo</span>.
            </h2>
            <ol className="mt-4 space-y-1.5 sm:mt-6 sm:space-y-2">
              {JOURNEY_STEPS.map((s, i) => {
                const active = i === step;
                return (
                  <li
                    key={s.n}
                    className={`rounded-2xl border px-4 py-2 transition-all duration-500 sm:px-5 sm:py-3 ${
                      active ? "border-gold/40 bg-gold/[0.07]" : "border-transparent opacity-45"
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className={`font-display text-sm ${active ? "text-gold" : "text-ivory/50"}`}>{s.n}</span>
                      <div>
                        <h3 className="font-sans text-sm font-semibold text-ivory sm:text-base">{s.title}</h3>
                        <p className={`overflow-hidden text-sm leading-relaxed text-ivory/60 transition-all duration-500 ${active ? "mt-1 max-h-32" : "max-h-0 sm:max-h-0"}`}>
                          {s.body}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* 3D stage */}
          <div className="perspective relative h-[40svh] min-w-0 sm:h-[62svh]">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.52] sm:scale-[0.72] xl:scale-[0.9] 2xl:scale-100">
              <Stage p={p} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stage({ p }: { p: MotionValue<number> }) {
  // 0 – 0.25: passport tilts in and opens
  const bookRotX = useTransform(p, [0, 0.2], [62, 18]);
  const bookRotZ = useTransform(p, [0, 0.2], [-18, -6]);
  // Closed book is centered; as the cover swings left, shift right so the open spread stays centered.
  const bookX = useTransform(p, [0.08, 0.24], [0, 145]);
  const bookScale = useTransform(p, [0, 0.2, 0.55, 0.75], [0.78, 1, 1, 1.04]);
  const coverRot = useTransform(p, [0.08, 0.24], [0, -178]);
  // 0.25 – 0.5: OK-to-Board pass slides up
  const passY = useTransform(p, [0.26, 0.44, 0.56, 0.68], [420, 150, 150, 520]);
  const passRotX = useTransform(p, [0.26, 0.44], [55, 8]);
  const passOpacity = useTransform(p, [0.26, 0.32, 0.6, 0.68], [0, 1, 1, 0]);
  const approved = useTransform(p, [0.4, 0.45], [0, 1]);
  const approvedScale = useTransform(p, [0.4, 0.45], [2, 1]);
  // 0.5 – 0.75: plane crosses
  const planeProgress = useTransform(p, [0.5, 0.74], [0, 1]);
  const planeX = useTransform(planeProgress, [0, 1], [-420, 420]);
  const planeY = useTransform(planeProgress, [0, 0.5, 1], [120, -170, 60]);
  const planeRot = useTransform(planeProgress, [0, 0.5, 1], [-28, 0, 24]);
  const planeOpacity = useTransform(p, [0.5, 0.54, 0.7, 0.75], [0, 1, 1, 0]);
  const pathLength = useTransform(planeProgress, [0, 1], [0, 1]);
  // 0.75 – 1: stamp slams and the QR visa appears
  const stampScale = useTransform(p, [0.76, 0.82], [3.2, 1]);
  const stampOpacity = useTransform(p, [0.76, 0.79], [0, 1]);
  const shake = useTransform(p, [0.81, 0.82, 0.83, 0.84], [0, -6, 4, 0]);
  const qrScale = useTransform(p, [0.86, 0.94], [0.4, 1]);
  const qrOpacity = useTransform(p, [0.86, 0.9], [0, 1]);

  return (
    <div className="relative h-[520px] w-[640px]">
      {/* flight path */}
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 640 520" aria-hidden>
        <motion.path
          d="M -100 380 Q 320 -10 740 330"
          fill="none"
          stroke="rgba(235,196,135,0.55)"
          strokeWidth="2"
          strokeDasharray="2 10"
          strokeLinecap="round"
          style={{ pathLength, opacity: planeOpacity }}
        />
      </svg>

      <motion.div style={{ x: shake }} className="absolute inset-0 flex items-center justify-center">
        <motion.div
          style={{ rotateX: bookRotX, rotateZ: bookRotZ, x: bookX, scale: bookScale }}
          className="preserve-3d relative h-[400px] w-[290px] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)]"
        >
          {/* Right page: visa page */}
          <div className="absolute inset-0 overflow-hidden rounded-r-2xl rounded-l-sm bg-[#f6efe0] p-6 text-night-900">
            <div aria-hidden className="absolute inset-0 opacity-[0.18] [background:repeating-radial-gradient(circle_at_30%_40%,#0a6a5c_0_1px,transparent_1px_9px)]" />
            <div className="relative">
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-emerald">Visa · Entry</p>
              <p className="mt-1 font-display text-xl text-emerald-dark">Egypt Visa on Arrival</p>
              <div className="mt-4 space-y-2.5">
                {["Traveler", "Nationality", "Port of entry", "Valid"].map((f, i) => (
                  <div key={f} className="border-b border-emerald/20 pb-1.5">
                    <p className="text-[8px] uppercase tracking-widest text-emerald/60">{f}</p>
                    <p className="font-mono text-[11px] text-night-900/80">{["SAMPLE TRAVELER", "—", "CAIRO (CAI)", "30 DAYS"][i]}</p>
                  </div>
                ))}
              </div>
            </div>
            <motion.div
              style={{ scale: stampScale, opacity: stampOpacity }}
              className="absolute bottom-16 right-4 flex h-32 w-32 rotate-[-14deg] flex-col items-center justify-center rounded-full border-[5px] border-double border-emerald-light bg-emerald-light/[0.06] text-center text-emerald-light shadow-[0_0_0_2px_rgba(10,106,92,0.25)]"
            >
              <span className="text-[8px] font-bold uppercase tracking-[0.25em]">Cairo · Arrival</span>
              <span className="font-display text-3xl font-semibold leading-none">$36</span>
              <span className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.2em]">Visa paid</span>
            </motion.div>
            <motion.div style={{ scale: qrScale, opacity: qrOpacity }} className="absolute bottom-5 left-5 flex items-center gap-2">
              <div className="rounded-md bg-white p-1 shadow">
                <QrPattern className="h-16 w-16" />
              </div>
              <span className="max-w-[70px] text-[9px] font-semibold uppercase leading-tight tracking-wider text-emerald">Digital QR visa</span>
            </motion.div>
          </div>

          {/* Cover (hinged on the left edge) */}
          <motion.div style={{ rotateY: coverRot }} className="preserve-3d absolute inset-0 origin-left">
            <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-between rounded-r-2xl rounded-l-sm bg-gradient-to-br from-emerald-light via-emerald to-emerald-dark p-8 ring-1 ring-black/30">
              <div aria-hidden className="absolute inset-3 rounded-xl border border-gold/30" />
              <p className="relative text-[10px] font-semibold uppercase tracking-[0.4em] text-gold">Passport</p>
              <svg viewBox="0 0 100 100" className="relative h-28 w-28 text-gold" aria-hidden>
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1 3" />
                <path d="M22 72 50 26l28 46Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M38 72 50 52l12 20" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <path d="M30 44c10-8 30-14 44-10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <p className="relative font-display text-lg tracking-[0.2em] text-gold/90">TRAVEL DOCUMENT</p>
            </div>
            <div className="backface-hidden absolute inset-0 rounded-l-2xl rounded-r-sm bg-[#efe5d0] p-6 [transform:rotateY(180deg)]">
              <div aria-hidden className="absolute inset-0 opacity-25 [background:repeating-linear-gradient(35deg,#c7934f_0_1px,transparent_1px_7px)]" />
              <div className="relative flex h-full flex-col justify-between">
                <p className="font-display text-lg text-emerald-dark">Bon voyage.</p>
                <div className="space-y-2">
                  <div className="h-2 w-3/4 rounded bg-emerald/15" />
                  <div className="h-2 w-2/3 rounded bg-emerald/15" />
                  <div className="h-2 w-1/2 rounded bg-emerald/15" />
                </div>
                <p className="font-mono text-[9px] tracking-widest text-emerald/60">P&lt;&lt;MISRVISA&lt;&lt;SAMPLE&lt;&lt;&lt;&lt;&lt;&lt;</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* OK-to-Board boarding pass */}
      <motion.div
        style={{ y: passY, rotateX: passRotX, opacity: passOpacity }}
        className="absolute left-1/2 top-0 w-[360px] -translate-x-1/2"
      >
        <div className="relative flex overflow-hidden rounded-2xl bg-ivory text-night-900 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.85)]">
          <div className="flex-1 p-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-emerald">Boarding pass</p>
            <div className="mt-3 flex items-center justify-between font-display text-3xl text-night-900">
              <span>LOS</span>
              <span className="text-base text-gold-dark">✈</span>
              <span>CAI</span>
            </div>
            <p className="mt-2 text-[11px] text-night-900/60">EgyptAir · Ethiopian Airlines</p>
          </div>
          <div className="relative flex w-28 flex-col items-center justify-center border-l-2 border-dashed border-night-900/15 bg-emerald p-3 text-center text-ivory">
            <motion.div style={{ opacity: approved, scale: approvedScale }}>
              <p className="text-[9px] uppercase tracking-widest text-gold">OK to</p>
              <p className="font-display text-xl leading-none">Board</p>
              <p className="mt-2 rounded-full bg-emerald-glow/30 px-2 py-0.5 text-[9px] font-semibold uppercase">✓ 24–48h</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Plane */}
      <motion.div style={{ x: planeX, y: planeY, rotate: planeRot, opacity: planeOpacity }} className="absolute left-1/2 top-1/2 -ml-8 -mt-8">
        <svg viewBox="0 0 64 64" className="h-16 w-16 drop-shadow-[0_0_24px_rgba(235,196,135,0.8)]" aria-hidden>
          <path fill="#ebc487" d="M62 30.5c0-2-1.6-3.4-3.6-3.4H41.2L27.8 5h-6.4l7.2 22.1H14.4L9.6 20H4.8l3 11.5-3 11.5h4.8l4.8-7.1h14.2L21.4 58h6.4l13.4-22.1h17.2c2 0 3.6-1.4 3.6-3.4Z" />
        </svg>
      </motion.div>
    </div>
  );
}
