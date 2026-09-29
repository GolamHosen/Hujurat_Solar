import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Image as ImageIcon,
  Wrench,
  MapPin,
  Newspaper,
  MessageSquareQuote,
  Users,
  Search,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/media", label: "Media", icon: ImageIcon },
  { href: "/dashboard/services", label: "Services", icon: Wrench },
  { href: "/dashboard/locations", label: "Locations", icon: MapPin },
  { href: "/dashboard/blog", label: "Blog", icon: Newspaper },
  { href: "/dashboard/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/seo", label: "SEO", icon: Search },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  // Defence in depth. The proxy already gates /dashboard/** and every Server
  // Action re-checks the session; this guarantees an unauthenticated request can
  // never render dashboard data, even if the matcher is changed later.
  // The sign-in route lives in the (dashboard-auth) route group, so it is not
  // wrapped by this layout and cannot loop back here.
  if (!session) {
    redirect("/dashboard/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-slate-300 lg:flex h-full">
        <div className="flex items-center gap-2 border-b border-slate-800 px-6 py-5 shrink-0">
          <span className="font-display text-base font-extrabold text-white">Hujurat Solar</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 border-t border-slate-800 p-4 shrink-0">
          <Link href="/" target="_blank" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white">
            <ExternalLink className="h-3.5 w-3.5" /> View live site
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white">
              <LogOut className="h-3.5 w-3.5" /> Log out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col h-full min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur px-6 py-4 lg:px-8 shrink-0">
          <div>
            <p className="text-xs text-slate-500">Welcome back,</p>
            <p className="text-sm font-semibold text-slate-900">{session.name}</p>
          </div>
          <form action={logoutAction} className="lg:hidden">
            <button type="submit" className="text-xs font-semibold text-slate-500">
              Log out
            </button>
          </form>
        </header>
        <main className="flex-1 px-6 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
