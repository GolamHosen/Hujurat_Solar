"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Sun, Battery, PiggyBank } from "lucide-react";

const ROOF_FACTORS: Record<string, number> = {
  north: 1,
  "east-west": 0.88,
  south: 0.72,
};

export default function SolarCalculator() {
  const [monthlyBill, setMonthlyBill] = useState(280);
  const [roofType, setRoofType] = useState<"north" | "east-west" | "south">("north");
  const [wantsBattery, setWantsBattery] = useState(true);

  const results = useMemo(() => {
    const annualSpend = monthlyBill * 12;
    // Approx $0.32/kWh average NSW residential rate
    const annualUsageKwh = annualSpend / 0.32;
    const dailyUsageKwh = annualUsageKwh / 365;

    // Sydney average ~4.1 peak sun hours/day
    const peakSunHours = 4.1;
    const roofFactor = ROOF_FACTORS[roofType];

    let recommendedKw = dailyUsageKwh / (peakSunHours * roofFactor * 0.85);
    recommendedKw = Math.min(Math.max(recommendedKw, 3), 30);
    const standardSizes = [3.3, 6.6, 8.3, 10, 13.3, 16.6, 20, 25, 30];
    const systemSizeKw = standardSizes.reduce((prev, curr) =>
      Math.abs(curr - recommendedKw) < Math.abs(prev - recommendedKw) ? curr : prev
    );

    const annualGenerationKwh = systemSizeKw * peakSunHours * 365 * roofFactor;
    const selfConsumptionRate = wantsBattery ? 0.75 : 0.45;
    const usedOnSite = Math.min(annualGenerationKwh * selfConsumptionRate, annualUsageKwh);
    const exported = Math.max(annualGenerationKwh - usedOnSite, 0);

    const savingsFromUsage = usedOnSite * 0.32;
    const savingsFromExport = exported * 0.06;
    const annualSavings = savingsFromUsage + savingsFromExport;

    const batteryKwh = wantsBattery ? Math.min(Math.max(Math.round((dailyUsageKwh * 0.5) / 1.35) * 1.35, 5), 20) : 0;

    const systemCost = systemSizeKw * 950 + (wantsBattery ? batteryKwh * 950 : 0);
    const paybackYears = systemCost / Math.max(annualSavings, 1);

    return {
      annualUsageKwh: Math.round(annualUsageKwh),
      systemSizeKw,
      annualGenerationKwh: Math.round(annualGenerationKwh),
      annualSavings: Math.round(annualSavings),
      batteryKwh,
      paybackYears: Math.round(paybackYears * 10) / 10,
      estimatedCost: Math.round(systemCost / 100) * 100,
    };
  }, [monthlyBill, roofType, wantsBattery]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-7">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-slate-950">
          <Calculator className="h-5 w-5 text-brand-dark" /> Tell us about your home
        </h2>

        <div className="mt-6">
          <label className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
            Average monthly electricity bill
            <span className="font-semibold text-brand-dark">${monthlyBill}</span>
          </label>
          <input
            type="range"
            min={80}
            max={900}
            step={10}
            value={monthlyBill}
            onChange={(e) => setMonthlyBill(Number(e.target.value))}
            className="w-full accent-[#f5a524]"
          />
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">Roof orientation</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "north", label: "North-facing" },
              { value: "east-west", label: "East / West" },
              { value: "south", label: "South-facing" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRoofType(option.value as typeof roofType)}
                className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                  roofType === option.value ? "border-brand bg-brand/10 text-brand-dark" : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3.5">
          <span className="text-sm font-medium text-slate-700">Include battery storage</span>
          <button
            type="button"
            onClick={() => setWantsBattery((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition ${wantsBattery ? "bg-brand" : "bg-slate-300"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${wantsBattery ? "left-5" : "left-0.5"}`} />
          </button>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-slate-500">
          This calculator provides an indicative estimate only, based on typical Sydney sun hours and average
          electricity rates. Your final recommendation may vary based on a full site assessment.
        </p>
      </div>

      <motion.div
        key={`${monthlyBill}-${roofType}-${wantsBattery}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl bg-slate-950 p-7 text-white"
      >
        <h2 className="font-display text-xl font-bold">Your estimated system</h2>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-white/5 p-5">
            <Sun className="h-5 w-5 text-brand" />
            <p className="mt-3 font-display text-2xl font-extrabold">{results.systemSizeKw} kW</p>
            <p className="text-xs text-slate-400">Recommended system size</p>
          </div>
          <div className="rounded-xl bg-white/5 p-5">
            <Battery className="h-5 w-5 text-brand" />
            <p className="mt-3 font-display text-2xl font-extrabold">{results.batteryKwh > 0 ? `${results.batteryKwh} kWh` : "N/A"}</p>
            <p className="text-xs text-slate-400">Suggested battery size</p>
          </div>
          <div className="rounded-xl bg-white/5 p-5">
            <PiggyBank className="h-5 w-5 text-brand" />
            <p className="mt-3 font-display text-2xl font-extrabold">${results.annualSavings.toLocaleString()}</p>
            <p className="text-xs text-slate-400">Estimated annual savings</p>
          </div>
          <div className="rounded-xl bg-white/5 p-5">
            <Calculator className="h-5 w-5 text-brand" />
            <p className="mt-3 font-display text-2xl font-extrabold">{results.paybackYears} yrs</p>
            <p className="text-xs text-slate-400">Estimated payback period</p>
          </div>
        </div>

        <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm text-slate-300">
          <div className="flex justify-between">
            <span>Estimated annual generation</span>
            <span className="font-semibold text-white">{results.annualGenerationKwh.toLocaleString()} kWh</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated system cost (before rebates)</span>
            <span className="font-semibold text-white">${results.estimatedCost.toLocaleString()}</span>
          </div>
        </div>

        <a
          href="/contact"
          className="mt-7 block rounded-full bg-brand px-6 py-3.5 text-center text-sm font-semibold text-slate-950 transition hover:bg-brand-dark"
        >
          Get an accurate, free quote
        </a>
      </motion.div>
    </div>
  );
}
