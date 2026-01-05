export interface GenerateSequenceInput {
  prospectUrl: string;
  companyId: string;
  tovConfigId: string;
  messageCount: number;
}

export interface GenerateSequenceResult {
  sequenceId: string;
  prospectId: string;
  messages: Array<{
    id: string;
    body: string;
    confidence: number | null;
  }>;
}
