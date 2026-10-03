import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, HeartHandshake, ShieldCheck, Users } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About Us | Hujurat Solar Supply & Install",
  description:
    "Hujurat Solar Supply & Install is a locally owned, CEC-accredited solar and battery installer based in Western Sydney, serving homeowners and businesses across NSW.",
  path: "/about",
});

const VALUES = [
  { icon: ShieldCheck, title: "CEC Accredited", description: "Every installer holds current Clean Energy Council accreditation and follows Australian wiring standards." },
  { icon: HeartHandshake, title: "Honest Advice", description: "We size systems around your real usage, not the biggest sale — including telling you when solar isn't the right fit yet." },
  { icon: Award, title: "Quality Equipment", description: "We only supply Tier-1 panels, inverters and batteries backed by strong local warranty support." },
  { icon: Users, title: "Local Team", description: "Based in Western Sydney, our own installers — not subcontractors — complete every job." },
];

export default function AboutPage() {
  return (
    <div>
      <Breadcrumbs items={[{ name: "About", path: "/about" }]} />
      <section className="section-container grid gap-10 py-14 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">About Hujurat Solar</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-slate-950 sm:text-5xl">
            Local solar experts, honest advice
          </h1>
          <p className="mt-5 text-slate-600">
            Hujurat Solar Supply &amp; Install was founded with a simple goal: help
            Australian households and businesses switch to solar with honest advice, quality equipment and
            workmanship they can trust. We&apos;re based in Western Sydney and have completed lots of
            residential and commercial installations across Greater Sydney.
          </p>
          <p className="mt-4 text-slate-600">
            Every system we design is based on your actual electricity usage, roof characteristics and budget —
            not a one-size-fits-all package. Our installers are Clean Energy Council accredited, and we manage
            every stage in-house: site assessment, design, approvals, installation and grid connection.
          </p>
          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-dark">
            Get a free quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative h-80 w-full overflow-hidden rounded-2xl sm:h-96">
          <Image src="/images/about-team.jpg" alt="Hujurat Solar installation team" fill className="object-cover" sizes="(min-width:1024px) 50vw, 100vw" />
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="section-container">
          <h2 className="text-center font-display text-3xl font-extrabold text-slate-950">Why homeowners choose us</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <div key={value.title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand-dark">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-slate-950">{value.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            ["500+", "Systems installed"],
            ["25 yr", "Panel performance warranties"],
            ["100%", "In-house installation team"],
          ].map(([stat, label]) => (
            <div key={label} className="rounded-2xl bg-slate-950 p-8 text-center text-white">
              <p className="font-display text-4xl font-extrabold text-brand">{stat}</p>
              <p className="mt-2 text-sm text-slate-300">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
