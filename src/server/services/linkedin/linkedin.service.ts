import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { prospects } from "~/server/db/schema";
import { env } from "~/env";
import {
  linkedInProfileSchema,
  type ScrapedProfileResult,
} from "./types";
import type { ILinkedInService } from "./linkedin.interface";

export class LinkedInService implements ILinkedInService {
  extractLinkedInId(url: string): string {
    const patterns = [
      /linkedin\.com\/in\/([^\/\?]+)/,
      /linkedin\.com\/pub\/([^\/\?]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) {
        return match[1];
      }
    }

    throw new Error("Invalid LinkedIn URL format");
  }

  async scrapeProfile(url: string): Promise<ScrapedProfileResult> {
    if (!env.SCRAPINGDOG_API_KEY) {
      throw new Error("SCRAPINGDOG_API_KEY not configured");
    }

    const linkedinId = this.extractLinkedInId(url);

    const apiUrl = new URL("https://api.scrapingdog.com/profile/");
    apiUrl.searchParams.append("api_key", env.SCRAPINGDOG_API_KEY);
    apiUrl.searchParams.append("type", "profile");
    apiUrl.searchParams.append("id", linkedinId);
    apiUrl.searchParams.append("premium", "true");

    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Scrapingdog API error: ${response.status} - ${errorText}`,
      );
    }

    const data = (await response.json()) as unknown;
    
    // Handle case where API returns an array instead of object
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const profileData = Array.isArray(data) ? data[0] : data;
    
    if (!profileData) {
      throw new Error("No profile data returned from Scrapingdog API");
    }
    
    const profile = linkedInProfileSchema.parse(profileData);

    return {
      linkedinId,
      linkedinUrl: url,
      profile,
    };
  }

  async getOrCreateProspect(url: string) {
    const existing = await db.query.prospects.findFirst({
      where: eq(prospects.linkedinUrl, url),
    });

    if (existing) {
      return existing;
    }

    const scraped = await this.scrapeProfile(url);

    const [prospect] = await db
      .insert(prospects)
      .values({
        linkedinUrl: scraped.linkedinUrl,
        profileData: scraped.profile,
      })
      .returning();

    return prospect!;
  }

  async updateProspect(url: string) {
    const scraped = await this.scrapeProfile(url);

    const [updated] = await db
      .update(prospects)
      .set({
        profileData: scraped.profile,
        updatedAt: new Date(),
      })
      .where(eq(prospects.linkedinUrl, url))
      .returning();

    return updated!;
  }
}

export const linkedInService = new LinkedInService();
