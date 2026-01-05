import { z } from "zod";

export const linkedInProfileSchema = z.object({
  fullName: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  headline: z.string().optional(),
  about: z.string().optional(),
  location: z.string().optional(),
  followers: z.string().optional(),
  connections: z.string().optional(),
  experience: z
    .array(
      z.object({
        company_name: z.string().optional(),
        title: z.string().optional(),
        duration: z.string().optional(),
        description: z.string().optional(),
        company_image: z.string().optional(),
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
  languages: z
    .array(
      z.object({
        name: z.string().optional(),
        level: z.string().optional(),
      }),
    )
    .optional(),
  certification: z
    .array(
      z.object({
        certification: z.string().optional(),
        company_name: z.string().optional(),
        issue_date: z.string().optional(),
      }),
    )
    .optional(),
  articles: z
    .array(
      z.object({
        title: z.string().optional(),
        published_date: z.string().optional(),
        link: z.string().optional(),
      }),
    )
    .optional(),
});

export type LinkedInProfile = z.infer<typeof linkedInProfileSchema>;

export interface ScrapedProfileResult {
  linkedinId: string;
  linkedinUrl: string;
  profile: LinkedInProfile;
}
