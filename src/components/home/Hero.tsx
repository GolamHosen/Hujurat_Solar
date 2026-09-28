"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import gsap from "gsap";
import {
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  TrendingUp,
  Sun,
  BatteryCharging,
} from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasVideoError, setHasVideoError] = useState(false);

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

    const ctx = gsap.context(() => {
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
        y: -10,
        rotation: 1,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.8,
      });

      gsap.fromTo(
        ".shimmer-sweep",
        { x: "-120%" },
        {
          x: "220%",
          duration: 3.5,
          repeat: -1,
          repeatDelay: 4,
          ease: "power2.inOut",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] overflow-hidden bg-slate-950 text-white"
    >
      {/* Background ambient lighting */}
      <motion.div style={{ y: backgroundY }} className="pointer-events-none absolute inset-0">
        <div
          ref={glowRef}
          className="absolute -top-32 left-1/4 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-brand/20 blur-[130px]"
        />
        <div className="absolute top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,165,36,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-grid opacity-10" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity }}
        className="section-container relative z-10 flex min-h-[92vh] flex-col justify-center py-20 lg:py-24"
      >
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7">
            {/* Pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand backdrop-blur-md shadow-[0_0_20px_rgba(245,165,36,0.15)]">
                <Sparkles className="h-3.5 w-3.5 text-brand" />
                Sydney &amp; Western Sydney Solar Specialists
              </span> */}
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-display text-[clamp(2.5rem,5.5vw,4.6rem)] font-extrabold leading-[1.04] text-white text-balance"
            >
              Power your home with{" "}
              <span className="relative inline-block bg-gradient-to-r from-amber-400 via-brand to-yellow-200 bg-clip-text text-transparent">
                Hujurat solar
                <svg
                  className="absolute -bottom-2 left-0 w-full text-brand/40"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9C75 3 225 3 297 9"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
            >
              High-efficiency solar panels, intelligent battery storage, and complete CEC-certified
              installations tailored for Australian rooftops. Cut bills by up to 80% from day one.
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
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand px-8 py-4 text-sm font-bold text-slate-950 shadow-[0_0_30px_rgba(245,165,36,0.35)] transition-all duration-300 hover:bg-brand-dark hover:shadow-[0_0_40px_rgba(245,165,36,0.55)] hover:scale-[1.02]"
              >
                <span>Get a Free Quote</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/solar-calculator"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-brand hover:bg-white/10 hover:text-brand"
              >
                <Sun className="h-4 w-4 text-brand" />
                <span>Estimate Savings</span>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 sm:gap-6"
            >
              {[
                { icon: ShieldCheck, label: "CEC Accredited", sub: "Master Electricians" },
                { icon: Zap, label: "500+ Installs", sub: "Across Sydney" },
                { icon: Star, label: "5.0 Rating", sub: "Google & Trust" },
              ].map(({ icon: ItemIcon, label, sub }) => (
                <div key={label} className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-1.5 text-brand">
                    <ItemIcon className="h-4 w-4" />
                    <span className="font-display text-sm font-bold text-white sm:text-base">
                      {label}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 sm:text-xs">{sub}</span>
                </div>
              ))}
            </motion.div>
          </div>
          {/* Right Column: Hero Visual (Image/Video Showcase with GSAP & Motion) */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-[520px] lg:max-w-none"
            >
              {/* Outer decorative gradient border */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-br from-brand/50 via-amber-500/20 to-transparent opacity-80 blur-lg" />

              {/* Media Card */}
              <div
                ref={mediaContainerRef}
                className="group relative overflow-hidden rounded-3xl border border-white/15 bg-slate-900/90 shadow-2xl backdrop-blur-xl"
              >
                {/* Light sweep effect */}
                <div className="shimmer-sweep pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-20" />

                {/* Aspect ratio container */}
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-slate-950">
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    poster="/images/project-residential.jpg"
                    onError={() => setHasVideoError(true)}
                    className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${hasVideoError ? "hidden" : "block"
                      }`}
                  >
                    <source src="/uploads/hero-solar.mp4" type="video/mp4" />
                    <source src="/hero-solar.mp4" type="video/mp4" />
                  </video>

                  {/* Fallback Image */}
                  <Image
                    src="/images/project-residential.jpg"
                    alt="Premium Residential Solar Installation in Sydney by Hujurat Solar"
                    fill
                    priority
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${hasVideoError ? "opacity-100" : "opacity-0"
                      }`}
                  />

                  {/* Gradient overlay on top of media */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Top media status badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/70 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Live Generation: <strong className="text-brand">8.4 kW</strong>
                  </div>

                  {/* Video Controls (if video source is active) */}
                  {!hasVideoError && (
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={togglePlay}
                        aria-label={isPlaying ? "Pause video" : "Play video"}
                        className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-slate-950/70 text-white backdrop-blur-md transition hover:bg-brand hover:text-slate-950"
                      >
                        {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={toggleMute}
                        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                        className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-slate-950/70 text-white backdrop-blur-md transition hover:bg-brand hover:text-slate-950"
                      >
                        {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  )}

                  {/* Bottom caption overlay */}
                  <div className="absolute bottom-4 inset-x-4 z-10 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                        Completed Project
                      </p>
                      <p className="font-display text-sm font-bold text-white sm:text-base">
                        12.6 kW Tier-1 Array + Sungrow Battery
                      </p>
                    </div>

                    <Link
                      href="/projects"
                      className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-brand hover:text-slate-950"
                    >
                      Gallery <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating Stat Card 1: Top Right */}
              <div className="floating-badge pointer-events-none absolute -top-5 -right-4 z-30 hidden rounded-2xl border border-white/15 bg-slate-900/90 p-3.5 shadow-xl backdrop-blur-md sm:flex sm:items-center sm:gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Est. Power Savings
                  </p>
                  <p className="font-display text-base font-extrabold text-white">
                    $2,850<span className="text-xs font-normal text-slate-400"> / year</span>
                  </p>
                </div>
              </div>

              {/* Floating Stat Card 2: Bottom Left */}
              <div className="floating-badge pointer-events-none absolute -bottom-6 -left-4 z-30 hidden rounded-2xl border border-white/15 bg-slate-900/90 p-3.5 shadow-xl backdrop-blur-md sm:flex sm:items-center sm:gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-brand">
                  <BatteryCharging className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Battery Independence
                  </p>
                  <p className="font-display text-base font-extrabold text-white">
                    94% Clean Energy
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
