import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { siteConfig } from "@/lib/site";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-brand py-20">
      <div className="section-container relative z-10 flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-2xl font-display text-3xl font-extrabold text-slate-950 sm:text-4xl text-balance">
          Ready to see how much you could save with solar?
        </h2>
        <p className="max-w-xl text-sm text-slate-900/80">
          Get a free, no-obligation quote from a local CEC-accredited installer. We&apos;ll design a system around
          your roof, usage and budget — no pushy sales tactics.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Get a Free Quote <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={`tel:${siteConfig.phone}`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-950/20 bg-white/40 px-7 py-4 text-sm font-semibold text-slate-950 transition hover:bg-white/70"
          >
            <PhoneCall className="h-4 w-4" /> {siteConfig.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
