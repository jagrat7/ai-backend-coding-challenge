import type { GenerateSequenceInput, GenerateSequenceResult } from "./types";

export interface ISequenceService {
  generateSequence(
    input: GenerateSequenceInput,
  ): Promise<GenerateSequenceResult>;
}
