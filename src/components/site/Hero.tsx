"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { WHATSAPP_LINK } from "@/lib/content/social";
import { Arrow, Container, Eyebrow, GhostButton, GoldButton } from "@/components/site/ui";
import { HeroScene, QrPattern } from "@/components/site/motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const textOpacity = useTransform(scrollYProgress, [0.35, 0.95], [1, 0]);
  const cardRotate = useTransform(scrollYProgress, [0, 1], [-8, 28]);
  const cardScale = useTransform(scrollYProgress, [0, 1], [1, 0.75]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-32">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(235,196,135,0.12),transparent_55%)]" />
      <HeroScene />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-night-950 to-transparent" />
      <div aria-hidden className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-night-950/90 via-night-950/40 to-transparent lg:w-2/3" />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.25fr_1fr]">
        <motion.div style={reduced ? undefined : { y: textY, opacity: textOpacity }}>
          <div className="anim-fade-up">
            <Eyebrow>New 2026 · QR visa at Cairo Airport</Eyebrow>
          </div>
          <h1 className="mt-7 text-balance text-[2.6rem] font-medium leading-[1.02] tracking-tight text-ivory sm:text-6xl lg:text-7xl">
            {["Egypt Visa on Arrival.", "OK-to-Board", "in 24–48 hours."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <span
                  className="anim-rise block"
                  style={{ animationDelay: `${0.15 + i * 0.12}s` }}
                >
                  <span className={i === 1 ? "text-gold-gradient animate-shimmer pr-2 italic" : ""}>{line}</span>
                </span>
              </span>
            ))}
          </h1>
          <p
            style={{ animationDelay: "0.55s" }}
            className="anim-fade-up mt-7 max-w-xl text-pretty text-lg leading-relaxed text-ivory/70"
          >
            Send your passport and ticket. We get your OK-to-Board. Pay{" "}
            <strong className="font-semibold text-gold">USD 36</strong> for your QR visa when you land in Cairo.
          </p>
          <div style={{ animationDelay: "0.7s" }} className="anim-fade-up mt-10 flex flex-wrap gap-4">
            <GoldButton href="/apply">
              Start my application <Arrow />
            </GoldButton>
            <GhostButton href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              Ask on WhatsApp
            </GhostButton>
          </div>
        </motion.div>

        {/* Floating 3D visa card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotateY: -40 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.4, delay: 0.4, ease }}
          className="perspective hidden justify-center lg:flex"
        >
          <motion.div style={reduced ? undefined : { rotateX: cardRotate, scale: cardScale }} className="preserve-3d animate-float-slow">
            <div className="gold-frame preserve-3d relative w-[340px] rotate-[-6deg] rounded-[26px] bg-gradient-to-br from-night-700 via-emerald-dark to-night-900 p-6 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.9)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold/80">Egypt · Visa on arrival</p>
                  <p className="mt-2 font-display text-2xl text-ivory">Cairo International</p>
                </div>
                <span className="rounded-full border border-emerald-glow/50 bg-emerald-glow/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-glow">
                  Sample
                </span>
              </div>
              <div className="mt-6 flex items-end gap-5 [transform:translateZ(40px)]">
                <div className="rounded-xl bg-ivory p-2 shadow-lg">
                  <QrPattern className="h-28 w-28" />
                </div>
                <div className="pb-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">Pay on arrival</p>
                  <p className="font-display text-5xl leading-none text-gold-gradient">$36</p>
                  <p className="mt-2 text-[11px] text-ivory/55">$30 visa + $6 service</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between rounded-2xl border border-gold/20 bg-black/20 px-4 py-3 [transform:translateZ(24px)]">
                <span className="text-xs text-ivory/60">OK-to-Board</span>
                <span className="flex items-center gap-2 text-xs font-semibold text-emerald-glow">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-glow" /> Approved · 24–48h
                </span>
              </div>
              <div aria-hidden className="absolute -right-8 -top-10 h-24 w-24 rotate-12 rounded-full border-[3px] border-double border-gold/70 text-center font-display text-[10px] uppercase leading-[1.1] tracking-widest text-gold/80 [transform:translateZ(60px)]">
                <span className="flex h-full flex-col items-center justify-center">
                  Entry<br />
                  <span className="text-lg leading-none">CAI</span>
                  2026
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      <motion.a
        href="#journey"
        aria-label="Scroll to see how it works"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ivory/40 sm:flex"
        animate={reduced ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        Scroll
        <span className="h-10 w-px bg-gradient-to-b from-gold/70 to-transparent" />
      </motion.a>
    </section>
  );
}
