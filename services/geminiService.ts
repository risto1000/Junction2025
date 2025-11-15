
import { GoogleGenAI } from "@google/genai";
import type { Mentor, Learner } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function buildPrompt(mentor: Mentor, learners: Learner[]): string {
  const mentorProfile = `
    Mentor Details:
    - ID: ${mentor.id}
    - Skills: ${mentor.skills}
    - Availability: ${mentor.availability}
  `;

  const learnerProfiles = learners.map(learner => `
    Learner ID: ${learner.id}
    - Desired Skills: ${learner.desired_skills}
    - Availability: ${learner.availability}
  `).join('');

  return `
    You are a thoughtful matchmaker for a mentorship program connecting elderly mentors with young learners.
    Based on the following mentor profile, find the best learner to match them with from the list of learners.
    Prioritize a strong match in skills. Also, consider their availability.
    If a good match is found, respond with ONLY the Learner ID of the best match. For example: "Learner ID: 123".
    If no suitable match is found, respond with "No match found".

    ${mentorProfile}

    List of Learners:
    ${learnerProfiles}
  `;
}

export async function findMatchForMentor(mentor: Mentor, learners: Learner[]): Promise<number | null> {
  if (learners.length === 0) {
    return null;
  }

  const prompt = buildPrompt(mentor, learners);

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt
    });

    const llmResponseText = response.text.trim();
    
    if (llmResponseText.toLowerCase().includes("no match found")) {
      return null;
    }

    const match = llmResponseText.match(/Learner ID: (\d+)/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    
    return null;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a response from the matching service.");
  }
}
