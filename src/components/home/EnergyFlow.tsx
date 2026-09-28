"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sun, PanelsTopLeft, Cpu, BatteryCharging, Home as HomeIcon, PiggyBank } from "lucide-react";

const STEPS = [
  { icon: Sun, title: "Sunlight", description: "Australian sun hits your roof, generating clean, free energy every day." },
  { icon: PanelsTopLeft, title: "Solar Panels", description: "High-efficiency panels convert sunlight into DC electricity." },
  { icon: Cpu, title: "Inverter", description: "Your inverter converts DC power into usable AC electricity for your home." },
  { icon: BatteryCharging, title: "Battery Storage", description: "Excess energy is stored in your battery for use after dark." },
  { icon: HomeIcon, title: "Your Home", description: "Appliances and lighting are powered by your own clean energy." },
  { icon: PiggyBank, title: "Savings", description: "Any surplus is exported to the grid, earning feed-in credits." },
];

export default function EnergyFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 0.8", "end 0.3"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={containerRef} className="relative bg-slate-950 py-24 text-white">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">How solar works</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">From sunlight to savings</h2>
          <p className="mt-4 text-slate-400">
            Every Hujurat Solar system follows the same simple energy journey — designed and sized specifically for
            your roof and household usage.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-white/10 md:block" />
          <motion.div
            style={{ scaleX: lineScale }}
            className="absolute left-0 right-0 top-8 hidden h-px origin-left bg-brand md:block"
          />
          <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-6">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                data-reveal
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 grid h-16 w-16 place-items-center rounded-2xl border border-white/15 bg-slate-900 shadow-[0_0_0_6px_rgba(245,165,36,0.06)]">
                  <step.icon className="h-7 w-7 text-brand" />
                </div>
                <h3 className="mt-4 font-display text-sm font-bold">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
