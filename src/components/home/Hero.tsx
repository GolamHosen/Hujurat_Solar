"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
  Sun,
  BatteryCharging,
  TrendingUp,
  Home,
  Coins,
} from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const backgroundY = useTransform(smoothProgress, [0, 1], ["0%", "28%"]);
  const contentY = useTransform(smoothProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(smoothProgress, [0, 0.8], [1, 0.2]);

  useEffect(() => {
    if (!containerRef.current) return;

    let ctx: { revert: () => void } | undefined;

    import("gsap").then(({ default: gsap }) => {
      if (!containerRef.current) return;

      ctx = gsap.context(() => {
        if (glowRef.current) {
          gsap.to(glowRef.current, {
            scale: 1.25,
            opacity: 0.75,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        gsap.to(".floating-badge", {
          y: -8,
          rotation: 0.5,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          stagger: 0.6,
        });

        // Animate the golden arc glow lines
        gsap.to(".hero-arc-glow", {
          opacity: 0.95,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.4,
        });

        // Grid lines subtle pulse
        gsap.to(".hero-grid-lines", {
          opacity: 0.25,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }, containerRef);
    });

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="hero-section relative min-h-screen overflow-hidden bg-[#020817] text-[#FFFFFF]"
      style={{
        background: "radial-gradient(ellipse 90% 75% at 75% 25%, #071A32 0%, #020817 72%)",
      }}
    >
      {/* Background ambient lighting & golden energy arcs */}
      <motion.div style={{ y: backgroundY }} className="pointer-events-none absolute inset-0">
        {/* Warm Gold ambient glow behind house / arc */}
        <div
          ref={glowRef}
          className="absolute -top-28 right-1/4 h-[650px] w-[650px] rounded-full bg-[#FFB21C]/20 blur-[140px]"
        />
        {/* Navy Blue soft ambient fill */}
        <div className="absolute top-1/4 -left-20 h-[520px] w-[520px] rounded-full bg-[#071A32] blur-[130px]" />
        {/* Secondary Warm Gold glow at bottom right */}
        <div className="absolute bottom-6 right-10 h-[480px] w-[480px] rounded-full bg-[#FFB21C]/15 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,178,28,0.16),transparent_65%)]" />

        {/* ─── Bottom Laser Beam & 3D Perspective Grid ─── */}
        <svg
          className="hero-arc-glow absolute bottom-0 left-0 h-[45%] w-full pointer-events-none"
          viewBox="0 0 1400 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="laserBeamGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#FFB21C" stopOpacity="0" />
              <stop offset="12%" stopColor="#FFB21C" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#FFC83D" stopOpacity="1" />
              <stop offset="80%" stopColor="#FFB71B" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FFB71B" stopOpacity="0" />
            </linearGradient>
            <filter id="beamFilter">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Slicing golden laser beam */}
          <path
            d="M-50 365 C 250 340, 600 315, 1450 325"
            stroke="url(#laserBeamGrad)"
            strokeWidth="2.5"
            filter="url(#beamFilter)"
          />
          <path
            d="M-50 365 C 250 340, 600 315, 1450 325"
            stroke="#FFC83D"
            strokeWidth="1.2"
            opacity="0.95"
          />

          {/* Perspective grid lines */}
          <line x1="150" y1="345" x2="1400" y2="325" stroke="#263247" strokeWidth="1" opacity="0.75" />
          <line x1="220" y1="375" x2="1400" y2="355" stroke="#263247" strokeWidth="1" opacity="0.65" />
          <line x1="290" y1="410" x2="1400" y2="390" stroke="#263247" strokeWidth="1.2" opacity="0.55" />
          <line x1="360" y1="445" x2="1400" y2="425" stroke="#263247" strokeWidth="1.5" opacity="0.5" />

          {/* Vanishing angled lines fanning toward bottom-right */}
          <line x1="600" y1="328" x2="520" y2="450" stroke="#263247" strokeWidth="1" opacity="0.35" />
          <line x1="750" y1="325" x2="720" y2="450" stroke="#263247" strokeWidth="1" opacity="0.4" />
          <line x1="880" y1="325" x2="900" y2="450" stroke="#263247" strokeWidth="1" opacity="0.45" />
          <line x1="1000" y1="325" x2="1080" y2="450" stroke="#263247" strokeWidth="1" opacity="0.5" />
          <line x1="1120" y1="325" x2="1260" y2="450" stroke="#263247" strokeWidth="1" opacity="0.55" />
          <line x1="1240" y1="325" x2="1420" y2="450" stroke="#263247" strokeWidth="1" opacity="0.6" />
        </svg>

        {/* Subtle grid overlay */}
        <div className="hero-grid-lines absolute inset-0 bg-grid opacity-12" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity }}
        className="section-container relative z-10 flex min-h-[calc(100vh-5rem)] flex-col justify-start pt-12 sm:pt-14 lg:pt-18 pb-16 lg:pb-20"
      >
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* ─── Left Column: Content ─── */}
          <div className="lg:col-span-6 xl:col-span-6">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <span className="h-[2px] w-10 bg-[#FFB71B]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D7DEE9]">
                Clean Energy / Brighter Tomorrow
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 font-display text-[clamp(2.5rem,5.5vw,4.2rem)] font-extrabold leading-[1.08] text-[#FFFFFF] text-balance"
            >
              Power your home
              <br />
              with{" "}
              <span className="relative inline-block bg-gradient-to-r from-[#FFB71B] via-[#FFC83D] to-[#FFB71B] bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(255,183,27,0.38)]">
                Hujurat solar.
                <svg
                  className="absolute -bottom-2 left-0 w-full text-[#FFB71B]/50"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9C75 3 225 3 297 9"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-lg text-[15px] leading-relaxed text-[#D7DEE9] sm:text-base"
            >
              High-efficiency solar panels, intelligent battery storage, and
              Complete CEC-certified installations tailored for Australian rooftops.
              Cut bills by up to 80% from day one.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#FFB71B] px-8 py-4 text-sm font-bold text-[#061225] shadow-[0_0_28px_rgba(255,183,27,0.45)] transition-all duration-300 hover:bg-[#FFC83D] hover:shadow-[0_0_38px_rgba(255,200,61,0.65)] hover:scale-[1.02]"
              >
                <span>Get a Free Quote</span>
                <ArrowRight className="h-4 w-4 text-[#061225] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/solar-calculator"
                className="group inline-flex items-center gap-2 rounded-full border border-[#263247] bg-[#102039]/60 px-7 py-4 text-sm font-semibold text-[#FFFFFF] backdrop-blur-md transition-all duration-300 hover:border-[#FFB71B] hover:bg-[#102039] hover:text-[#FFC83D]"
              >
                <Sun className="h-4 w-4 text-[#FFB71B] transition-transform duration-300 group-hover:rotate-45" />
                <span>Estimate Savings</span>
              </Link>
            </motion.div>
          </div>

          {/* ─── Right Column: Hero Image with Floating Badges ─── */}
          <div className="lg:col-span-6 xl:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-[600px] lg:max-w-none"
            >
              {/* ─── Golden Halo Arc looping behind house card ─── */}
              <svg
                className="hero-arc-glow pointer-events-none absolute -top-16 -right-12 h-[540px] w-[540px] sm:-top-24 sm:-right-16 sm:h-[660px] sm:w-[660px] lg:-top-28 lg:-right-20 lg:h-[720px] lg:w-[720px] z-0"
                viewBox="0 0 700 700"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="arcGradHalo" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFC83D" stopOpacity="0" />
                    <stop offset="20%" stopColor="#FFC83D" stopOpacity="0.85" />
                    <stop offset="55%" stopColor="#FFB21C" stopOpacity="1" />
                    <stop offset="85%" stopColor="#FFB71B" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#FFB71B" stopOpacity="0" />
                  </linearGradient>
                  <filter id="haloGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="8" result="blur1" />
                    <feGaussianBlur stdDeviation="22" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur2" />
                      <feMergeNode in="blur1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <circle
                  cx="350"
                  cy="350"
                  r="280"
                  stroke="url(#arcGradHalo)"
                  strokeWidth="3.5"
                  filter="url(#haloGlowFilter)"
                />
                <circle
                  cx="350"
                  cy="350"
                  r="280"
                  stroke="#FFC83D"
                  strokeWidth="1.5"
                  opacity="0.95"
                />
              </svg>

              {/* Outer decorative glow */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#FFB21C]/35 via-[#071A32]/60 to-transparent opacity-90 blur-2xl" />

              {/* Main Image Card */}
              <div className="group relative overflow-hidden rounded-3xl border border-[#263247] bg-[#102039] shadow-[0_20px_50px_rgba(2,8,23,0.85)] backdrop-blur-xl">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#020817]">
                  <Image
                    src="/images/hero-solar-house.jpg"
                    alt="Premium Residential Solar Installation in Sydney by Hujurat Solar"
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Bottom gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020817]/60 via-transparent to-transparent" />
                </div>
              </div>

              {/* ─── Floating Badge: Live Generation (top right of image) ─── */}
              <div className="floating-badge pointer-events-none absolute -top-5 -right-3 z-30 hidden rounded-2xl border border-[#263247] bg-[#102039]/95 p-4 shadow-[0_12px_32px_rgba(2,8,23,0.7)] backdrop-blur-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#22C55E]/15 text-[#22C55E]">
                    <Zap className="h-5 w-5 fill-[#22C55E]/20 text-[#22C55E]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Live Generation
                    </p>
                    <p className="font-display text-xl font-extrabold text-[#FFFFFF]">
                      4.8 <span className="text-sm font-normal text-[#94A3B8]">kW</span>
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22C55E]" />
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">Now</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── Floating Badge: Est. Power Savings (bottom center-left) ─── */}
              <div className="floating-badge pointer-events-none absolute -bottom-6 left-4 sm:left-10 z-30 hidden rounded-2xl border border-[#FFB71B]/60 bg-[#102039]/95 p-4 shadow-[0_0_24px_rgba(255,178,28,0.22),0_12px_32px_rgba(2,8,23,0.7)] backdrop-blur-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFB71B]/15 text-[#FFB71B]">
                    <Coins className="h-5 w-5 text-[#FFB71B]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Est. Power Savings
                    </p>
                    <p className="font-display text-xl font-extrabold text-[#FFFFFF]">
                      $2,850 <span className="text-sm font-normal text-[#94A3B8]">/year</span>
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-[#22C55E]">
                      <TrendingUp className="h-3 w-3 text-[#22C55E]" />
                      ≈ 80% less electricity bills
                    </p>
                  </div>
                </div>
              </div>

              {/* ─── Floating Badge: Battery Independence (bottom right) ─── */}
              <div className="floating-badge pointer-events-none absolute -bottom-6 -right-3 z-30 hidden rounded-2xl border border-[#263247] bg-[#102039]/95 p-4 shadow-[0_12px_32px_rgba(2,8,23,0.7)] backdrop-blur-xl md:block">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#38BDF8]/15 text-[#38BDF8]">
                    <BatteryCharging className="h-5 w-5 text-[#38BDF8]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Battery Independence
                    </p>
                    <p className="font-display text-xl font-extrabold text-[#FFFFFF]">
                      94<span className="text-sm font-normal text-[#94A3B8]">%</span>
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#94A3B8]">
                      Clean energy, greater control
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ─── Bottom Trust Strip ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 mb-10 lg:mt-24"
        >
          <div className="flex flex-wrap items-center justify-start gap-8 sm:gap-12 lg:gap-14 pt-8 border-t border-[#263247]/70">
            {/* CEC Accredited */}
            <div className="flex items-center gap-3.5">
              <ShieldCheck className="h-8 w-8 text-[#FFB71B] stroke-[1.8]" />
              <div>
                <span className="font-display text-sm font-bold text-[#FFFFFF] sm:text-base">
                  CEC Accredited
                </span>
                <span className="block text-[11px] text-[#94A3B8] sm:text-xs">
                  Meets Australian Standards
                </span>
              </div>
            </div>

            <div className="hidden h-9 w-[1px] bg-[#263247] sm:block" />

            {/* 500+ Installs */}
            <div className="flex items-center gap-3.5">
              <Home className="h-8 w-8 text-[#FFB71B] stroke-[1.8]" />
              <div>
                <span className="font-display text-sm font-bold text-[#FFFFFF] sm:text-base">
                  500+ Installs
                </span>
                <span className="block text-[11px] text-[#94A3B8] sm:text-xs">
                  Across Sydney
                </span>
              </div>
            </div>

            <div className="hidden h-9 w-[1px] bg-[#263247] sm:block" />

            {/* 5.0 Rating */}
            <div className="flex items-center gap-3.5">
              <Star className="h-8 w-8 text-[#FFB71B] stroke-[1.8]" />
              <div>
                <span className="font-display text-sm font-bold text-[#FFFFFF] sm:text-base">
                  5.0 Rating
                </span>
                <span className="block text-[11px] text-[#94A3B8] sm:text-xs">
                  Google &amp; Trustpilot
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
