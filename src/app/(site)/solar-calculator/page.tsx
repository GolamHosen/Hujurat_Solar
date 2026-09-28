import Breadcrumbs from "@/components/site/Breadcrumbs";
import SolarCalculator from "@/components/tools/SolarCalculator";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Free Solar Savings Calculator | Hujurat Solar",
  description:
    "Estimate your recommended solar system size, battery size and potential annual savings with our free solar calculator for Sydney homes.",
  path: "/solar-calculator",
});

export default function SolarCalculatorPage() {
  return (
    <div>
      <Breadcrumbs items={[{ name: "Solar Calculator", path: "/solar-calculator" }]} />
      <section className="section-container py-14">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">Free tool</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-slate-950 sm:text-5xl">
            Solar savings calculator
          </h1>
          <p className="mt-5 text-slate-600">
            Get an instant, indicative estimate of the solar and battery system size that suits your home, along
            with potential annual savings.
          </p>
        </div>

        <div className="mt-12">
          <SolarCalculator />
        </div>
      </section>
    </div>
  );
}
