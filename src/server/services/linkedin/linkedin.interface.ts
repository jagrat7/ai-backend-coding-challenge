import type { ScrapedProfileResult } from "./types";

export interface ILinkedInService {
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
