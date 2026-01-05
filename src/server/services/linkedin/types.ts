import { z } from "zod";

export const linkedInProfileSchema = z.object({
  name: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  location: z.string().optional(),
  experience: z
    .array(
      z.object({
        title: z.string().optional(),
        company: z.string().optional(),
        duration: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),
  education: z
    .array(
      z.object({
        school: z.string().optional(),
        degree: z.string().optional(),
        field: z.string().optional(),
        dates: z.string().optional(),
      }),
    )
    .optional(),
  skills: z.array(z.string()).optional(),
});

export type LinkedInProfile = z.infer<typeof linkedInProfileSchema>;

export interface ScrapedProfileResult {
  linkedinId: string;
  linkedinUrl: string;
  profile: LinkedInProfile;
}
