import { db } from "@/db";
import { leads } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_SLOTS = [
  { id: "Morning (9:00 AM - 12:00 PM)", label: "Morning", time: "9:00 AM – 12:00 PM", icon: "🌅" },
  { id: "Midday (12:00 PM - 3:00 PM)", label: "Midday", time: "12:00 PM – 3:00 PM", icon: "☀️" },
  { id: "Afternoon (3:00 PM - 6:00 PM)", label: "Afternoon", time: "3:00 PM – 6:00 PM", icon: "🌇" },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { ok: false, error: "Valid date parameter in YYYY-MM-DD format is required" },
      { status: 400 }
    );
  }

  try {
    // Find active bookings for the specified date
    const bookedLeads = await db
      .select({
        timeSlot: leads.preferredTimeSlot,
      })
      .from(leads)
      .where(
        and(
          eq(leads.preferredDate, date),
          ne(leads.status, "lost")
        )
      );

    const slotCounts: Record<string, number> = {};
    for (const b of bookedLeads) {
      if (b.timeSlot) {
        slotCounts[b.timeSlot] = (slotCounts[b.timeSlot] || 0) + 1;
      }
    }

    // Capacity limit of 3 consultations per slot per day
    const MAX_PER_SLOT = 3;

    const slots = DEFAULT_SLOTS.map((s) => {
      const booked = slotCounts[s.id] || 0;
      const available = booked < MAX_PER_SLOT;
      const remaining = Math.max(0, MAX_PER_SLOT - booked);
      return {
        ...s,
        available,
        remaining,
        bookedCount: booked,
      };
    });

    return NextResponse.json({
      ok: true,
      date,
      slots,
    });
  } catch (error) {
    console.error("Failed to query calendar availability:", error);
    // Graceful fallback to default slots
    return NextResponse.json({
      ok: true,
      date,
      slots: DEFAULT_SLOTS.map((s) => ({ ...s, available: true, remaining: 3, bookedCount: 0 })),
    });
  }
}
