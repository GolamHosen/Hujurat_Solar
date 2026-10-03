import { createIcsCalendarContent } from "@/lib/calendar";
import { siteConfig } from "@/lib/site";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || `${siteConfig.shortName} Solar Consultation`;
  const dateStr = searchParams.get("date") || undefined;
  const timeSlot = searchParams.get("timeSlot") || undefined;
  const location = searchParams.get("location") || siteConfig.address;
  const description =
    searchParams.get("description") ||
    `Solar Consultation & Assessment with ${siteConfig.name}.\nContact: ${siteConfig.phoneDisplay} / ${siteConfig.phoneMobileDisplay}\nEmail: ${siteConfig.email}`;

  const icsContent = createIcsCalendarContent({
    title,
    description,
    dateStr,
    timeSlot,
    location,
  });

  return new NextResponse(icsContent, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="hujurat-solar-consultation.ics"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
