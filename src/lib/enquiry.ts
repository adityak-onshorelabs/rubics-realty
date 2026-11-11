import { z } from "zod";

export const intents = ["visit", "brochure", "callback"] as const;
export const configs = ["2 BHK", "3 BHK", "Jodi", "4 BHK with terrace", "Not sure yet"] as const;
export const windows = ["Morning", "Afternoon", "Evening"] as const;

export const enquirySchema = z
  .object({
    intent: z.enum(intents),
    project: z.string().trim().max(80).default("beaumonte-tower-c"),
    name: z.string().trim().min(2, "Please enter your name.").max(80, "That name is too long."),
    phone: z
      .string()
      .trim()
      .transform((v) => v.replace(/[\s()-]/g, ""))
      .pipe(z.string().regex(/^\+?\d{8,15}$/, "Please enter a phone number with country code if outside India.")),
    email: z.union([z.literal(""), z.email("Please check the email address.").max(120)]).default(""),
    config: z.enum(configs).optional(),
    level: z.coerce.number().int().min(-1).max(41).optional(),
    visitDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .or(z.literal("")),
    visitWindow: z.enum(windows).optional().or(z.literal("")),
    message: z.string().trim().max(1000, "Please keep the message under 1,000 characters.").default(""),
    consent: z.literal(true, { error: "Please confirm we may contact you about this enquiry." }),
    // Honeypot: real people never see or fill this.
    website: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.intent === "visit" && !v.visitDate) {
      ctx.addIssue({ code: "custom", path: ["visitDate"], message: "Please choose a preferred day." });
    }
  });

export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;

export const fieldErrors = (err: z.ZodError) => {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const k = String(issue.path[0] ?? "form");
    if (!out[k]) out[k] = issue.message;
  }
  return out;
};
