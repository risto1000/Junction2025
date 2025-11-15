import { GoogleGenerativeAI } from '@google/generative-ai';
import { Knex } from 'knex';
import { getDb } from './database.js';


/**
 * Find the best matching user for a saved user_description entry.
 * Uses Gemini (if GOOGLE_API_KEY is set) to rank candidates by relevance.
 * Falls back to the original simple heuristic when Gemini is unavailable or errors.
 */
export async function findBestMatch(descriptionId: number) {
  const db = getDb();

  const desc = await db('user_descriptions').where('id', descriptionId).first();
  if (!desc) return null;

  const userDescription = {
    name: (desc.name || '').toString(),
    profession: (desc.profession || '').toString(),
    location: (desc.location || '').toString(),
    availability: (desc.availability || '').toString()
  };

  const allUsers = await db('users').select('*');

  if (!allUsers || allUsers.length === 0) return null;

  function normalize(text: string) {
    return (text || '').toLowerCase();
  }

  // Build compact profile text for each user (used for prompt to Gemini)
  const candidates = allUsers.map(user => {
    let careerHighlights = '';
    try {
      if (user.career_highlights) {
        careerHighlights = Array.isArray(user.career_highlights)
          ? user.career_highlights.join(' ')
          : JSON.stringify(user.career_highlights);
      }
    } catch {
      careerHighlights = '';
    }
    const profileText = [
      user.full_name || '',
      user.tagline || '',
      careerHighlights || '',
      user.location || ''
    ].filter(Boolean).join(' · ');
    return {
      id: user.id,
      profileText,
      raw: user
    };
  });

  // Try to use Gemini (prompt-based ranking) if API key is available
  if (process.env.GOOGLE_API_KEY) {
    try {
      const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

      // include up to N candidates to keep prompt size reasonable
      const MAX_CANDIDATES = 12;
      const useCandidates = candidates.slice(0, MAX_CANDIDATES);

      // Build prompt
      const promptParts: string[] = [];
      promptParts.push('You are an assistant that ranks candidate user profiles against a user description.');
      promptParts.push('Return strictly a JSON object with keys: bestId (candidate id or null), score (0-1 number), reason (short explanation).');
      promptParts.push('');
      promptParts.push('User description:');
      promptParts.push(`Name: ${userDescription.name || '<none>'}`);
      promptParts.push(`Profession: ${userDescription.profession || '<none>'}`);
      promptParts.push(`Location: ${userDescription.location || '<none>'}`);
      promptParts.push(`Availability: ${userDescription.availability || '<none>'}`);
      promptParts.push('');
      promptParts.push('Candidates:');

      useCandidates.forEach((c, idx) => {
        // Escape any accidental newlines
        const safeText = c.profileText.replace(/\n/g, ' ');
        promptParts.push(`${idx + 1}. id: ${c.id} -- profile: ${safeText}`);
      });

      promptParts.push('');
      promptParts.push('Consider exact name match, relevant profession keywords, location match, and availability overlap. Score should be between 0 (no match) and 1 (perfect match).');

      const prompt = promptParts.join('\n');

      // Call Gemini - use a safe generic method name and tolerate differing return shapes
      const gResponse: any = await (client as any).generateText?.({
        model: 'gemini-1.0',
        input: prompt,
        temperature: 0
      }) ?? await (client as any).generate?.({ model: 'gemini-1.0', prompt, temperature: 0 });

      // Extract text output
      let textOut: string | null = null;
      if (!gResponse) throw new Error('Empty Gemini response');
      if (typeof gResponse === 'string') textOut = gResponse;
      else if (gResponse.outputText) textOut = gResponse.outputText;
      else if (gResponse.data && Array.isArray(gResponse.data) && gResponse.data[0]?.text) textOut = gResponse.data[0].text;
      else if (gResponse?.result) textOut = typeof gResponse.result === 'string' ? gResponse.result : JSON.stringify(gResponse.result);

      if (!textOut) throw new Error('Cannot parse Gemini response text');

      // Try to find JSON object in response
      const jsonMatch = textOut.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Gemini did not return JSON');
      const parsed = JSON.parse(jsonMatch[0]);

      if (parsed && parsed.bestId && parsed.score > 0) {
        // Find matching user by id
        const matched = allUsers.find(u => String(u.id) === String(parsed.bestId));
        if (matched) return matched;
      }

      // If Gemini returned no good match, fall through to heuristic
    } catch (err) {
      // Log and continue with heuristic fallback
      console.warn('Gemini ranking failed, falling back to heuristic:', err instanceof Error ? err.message : err);
    }
  }

  // Heuristic fallback (original logic)
  const descProfession = normalize(userDescription.profession);
  const descLocation = normalize(userDescription.location);
  const descAvailabilityTokens = normalize(userDescription.availability).split(/\W+/).filter(Boolean);

  let best: any = null;
  let bestScore = 0;

  for (const user of allUsers) {
    // Build searchable text from user fields
    const tagline = normalize(user.tagline || '');
    let careerHighlights = '';
    try {
      if (user.career_highlights) {
        careerHighlights = Array.isArray(user.career_highlights) ? user.career_highlights.join(' ') : normalize(JSON.stringify(user.career_highlights));
      }
    } catch {
      careerHighlights = '';
    }
    const userLocation = normalize(user.location || '');
    const combined = `${tagline} ${careerHighlights}`.toLowerCase();

    let score = 0;

    // Name exact match
    if (userDescription.name && normalize(user.full_name || '') === normalize(userDescription.name)) {
      score += 5;
    }

    // Profession match
    if (descProfession) {
      if (combined.includes(descProfession)) {
        score += 3;
      } else {
        // check token overlap
        const profTokens = descProfession.split(/\W+/).filter(Boolean);
        for (const t of profTokens) {
          if (t && combined.includes(t)) score += 1;
        }
      }
    }

    // Location match
    if (descLocation && userLocation && userLocation === descLocation) {
      score += 2;
    }

    // Availability token overlap with user tagline/career highlights
    for (const token of descAvailabilityTokens) {
      if (token && combined.includes(token)) score += 1;
    }

    // Simple tie-breaker: prefer users with non-null avatar (example)
    if (score > 0 && user.avatar) score += 0.1;

    if (score > bestScore) {
      bestScore = score;
      best = user;
    }
  }

  if (bestScore <= 0) return null;
  return best;
}