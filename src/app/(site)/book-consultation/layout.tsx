import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Book a Free Solar Consultation & Roof Assessment | Hujurat Solar",
  description:
    "Schedule an on-site solar roof assessment, phone consultation, or video meeting with Sydney's CEC-accredited solar & battery experts. Add directly to Google Calendar.",
  path: "/book-consultation",
});

export default function BookConsultationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
