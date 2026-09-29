import Breadcrumbs from "@/components/site/Breadcrumbs";
import SolarCalculator from "@/components/tools/SolarCalculator";
import JsonLd from "@/components/site/JsonLd";
import { buildMetadata, faqSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Free Solar Savings Calculator Sydney NSW | Hujurat Solar",
  description:
    "Calculate your recommended solar panel system size, battery storage capacity, annual electricity bill savings, and payback period for Sydney and NSW homes.",
  path: "/solar-calculator",
});

const CALCULATOR_FAQS = [
  {
    question: "How accurate is this solar savings calculation for Sydney homes?",
    answer:
      "This calculator models Sydney's average solar irradiance (approx. 4.2 peak sun hours daily), current New South Wales retail electricity tariffs (32c–38c/kWh grid import), and solar feed-in tariffs (5c–8c/kWh export). While actual savings vary with roof orientation, shading, and season, it provides a realistic indicative estimate based on real local data.",
  },
  {
    question: "What feed-in tariff (FiT) will I receive for excess solar exported in NSW?",
    answer:
      "Most NSW energy retailers currently offer between 5c and 8c per kilowatt-hour for exported solar electricity. Because retail electricity purchased from the grid costs 30c–40c/kWh, your greatest financial savings come from consuming your own solar energy during the day or storing it in a battery for evening use.",
  },
  {
    question: "How does the NSW Peak Demand Reduction Scheme (PDRS) battery rebate affect my return on investment?",
    answer:
      "The NSW PDRS incentive provides an upfront discount of up to $1,600 to $2,400 on approved home batteries. By reducing the net capital cost, the rebate typically compresses battery payback periods down from 9–11 years to just 6–8 years.",
  },
  {
    question: "Should I install a 6.6kW or 10kW solar system for my Sydney home?",
    answer:
      "A 6.6kW system is ideal for small to medium households with quarterly power bills around $400–$700. If your quarterly bill exceeds $800, or you run ducted air conditioning, have a pool pump, or intend to charge an electric vehicle (EV), a 10kW to 13.3kW system provides significantly higher bill offset and future capacity.",
  },
];

export default function SolarCalculatorPage() {
  return (
    <div>
      <Breadcrumbs items={[{ name: "Solar Calculator", path: "/solar-calculator" }]} />
      <JsonLd data={faqSchema(CALCULATOR_FAQS)} />

      <section className="section-container py-14">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">Free calculation tool</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-slate-950 sm:text-5xl">
            Solar &amp; Battery Savings Calculator
          </h1>
          <p className="mt-5 text-slate-600">
            Get an instant, indicative estimate of your recommended solar and battery system size, estimated annual
            power bill savings, and estimated payback period in Greater Sydney.
          </p>
        </div>

        <div className="mt-12">
          <SolarCalculator />
        </div>

        <div className="mt-20 border-t border-slate-200 pt-14">
          <h2 className="font-display text-2xl font-bold text-slate-950 sm:text-3xl">
            Frequently Asked Questions About Solar Calculations
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {CALCULATOR_FAQS.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-display text-base font-bold text-slate-900">{faq.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
