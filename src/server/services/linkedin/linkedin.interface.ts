import type { ScrapedProfileResult } from "./types";

export interface ILinkedInService {
  extractLinkedInId(url: string): string;
  scrapeProfile(url: string): Promise<ScrapedProfileResult>;
  getOrCreateProspect(url: string): Promise<{
    id: string;
    linkedinUrl: string;
    profileData: unknown;
    createdAt: Date;
    updatedAt: Date;
  }>;
  updateProspect(url: string): Promise<{
    id: string;
    linkedinUrl: string;
    profileData: unknown;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
