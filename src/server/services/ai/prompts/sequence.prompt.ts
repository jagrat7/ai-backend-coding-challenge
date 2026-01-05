import type { LinkedInProfile } from "../../linkedin/types";
import type { Company, TovConfig } from "../types";

export function buildSequencePrompt(
  profile: LinkedInProfile,
  company: Company,
  tovConfig: TovConfig,
  messageCount: number,
): string {
  const tovInstructions = translateTovToInstructions(tovConfig);

  return `You are an expert sales copywriter specializing in personalized outreach sequences.

# Task
Generate a ${messageCount}-message outreach sequence for the prospect below.

# Prospect Profile
Name: ${profile.name ?? "Unknown"}
Headline: ${profile.headline ?? "N/A"}
Location: ${profile.location ?? "N/A"}
Summary: ${profile.summary ?? "N/A"}

${
  profile.experience && profile.experience.length > 0
    ? `
Experience:
${profile.experience.map((exp) => `- ${exp.title ?? "N/A"} at ${exp.company ?? "N/A"} (${exp.duration ?? "N/A"})`).join("\n")}
`
    : ""
}

${
  profile.education && profile.education.length > 0
    ? `
Education:
${profile.education.map((edu) => `- ${edu.school ?? "N/A"} - ${edu.degree ?? "N/A"} ${edu.field ? `in ${edu.field}` : ""}`).join("\n")}
`
    : ""
}

${
  profile.skills && profile.skills.length > 0
    ? `
Skills: ${profile.skills.join(", ")}
`
    : ""
}

# Company Context
Company: ${company.name}
${company.description ? `Description: ${company.description}` : ""}
${company.industry ? `Industry: ${company.industry}` : ""}

Outreach Context: ${company.context}

# Tone of Voice Instructions
${tovInstructions}

# Requirements
1. Each message should be personalized based on the prospect's profile
2. Reference specific details from their experience, education, or skills
3. Progressive sequence: 
   - Message 1: Initial outreach (introduce value prop)
   - Message 2+: Follow-up (add social proof, urgency, or different angle)
   - Final message: Breakup email (polite close, leave door open)
4. Keep messages concise (50-150 words each)
5. Include a clear call-to-action in each message
6. Assign a confidence score (0-1) for each message based on personalization quality

# Output Format
Return a JSON object with:
- messages: Array of { body: string, confidence: number }
- thinkingProcess: Your reasoning for personalization choices

Think through your approach before generating the messages.`;
}

function translateTovToInstructions(tov: TovConfig): string {
  const instructions: string[] = [];

  // Formality (0 = casual, 1 = formal)
  if (tov.formality < 0.3) {
    instructions.push(
      "Use casual, conversational language. Contractions and informal phrasing are encouraged.",
    );
  } else if (tov.formality < 0.7) {
    instructions.push(
      "Use professional but approachable language. Balance formality with friendliness.",
    );
  } else {
    instructions.push(
      "Use formal, professional language. Avoid slang and contractions.",
    );
  }

  // Warmth (0 = cold/transactional, 1 = warm/personal)
  if (tov.warmth < 0.3) {
    instructions.push(
      "Keep tone business-focused and transactional. Get straight to the value proposition.",
    );
  } else if (tov.warmth < 0.7) {
    instructions.push(
      "Be friendly and personable while maintaining professionalism.",
    );
  } else {
    instructions.push(
      "Be warm, empathetic, and build genuine connection. Show authentic interest in the prospect.",
    );
  }

  // Directness (0 = subtle/soft, 1 = direct/explicit)
  if (tov.directness < 0.3) {
    instructions.push(
      "Be subtle and indirect. Use questions and suggestions rather than direct asks.",
    );
  } else if (tov.directness < 0.7) {
    instructions.push(
      "Be clear about your intent but not pushy. Balance directness with tact.",
    );
  } else {
    instructions.push(
      "Be direct and explicit about what you want. Clear call-to-action, no beating around the bush.",
    );
  }

  return instructions.join("\n");
}
