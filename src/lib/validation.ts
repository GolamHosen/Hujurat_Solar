import { z } from "zod";

export const leadFormSchema = z.object({
  name: z.string().min(2, "Please enter your full name").max(160),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(6, "Please enter a valid phone number").max(30),
  suburb: z.string().min(2, "Please enter your suburb").max(120),
  propertyType: z.enum(["residential", "commercial"]).default("residential"),
  electricityBill: z.string().optional().default(""),
  interestedService: z.string().optional().default(""),
  systemSizeInterest: z.string().optional().default(""),
  batteryRequired: z.boolean().optional().default(false),
  message: z.string().max(2000).optional().default(""),
  source: z
    .enum(["google_organic", "google_ads", "facebook", "instagram", "referral", "direct", "other"])
    .optional()
    .default("direct"),
});

export type LeadFormValues = z.input<typeof leadFormSchema>;

/**
 * Server Action arguments arrive over the network and can be any JSON value, so
 * database ids are validated instead of trusted.
 */
export function toPositiveInt(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

/** Guards Server Actions against callers that send something other than a form. */
export function assertFormData(formData: unknown): asserts formData is FormData {
  if (!formData || typeof (formData as FormData).get !== "function") {
    throw new Error("Invalid form submission.");
  }
}
