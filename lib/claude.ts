import { Platform } from 'react-native';
import { Difficulty, Question, Topic } from '@/types';

const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';

interface GenerateQuestionsParams {
  topic: Topic;
  count?: number;
  difficulty?: Difficulty;
}

export async function generateQuestions({
  topic,
  count = 5,
  difficulty,
}: GenerateQuestionsParams): Promise<Omit<Question, 'id'>[]> {
  const targetDifficulty = difficulty ?? topic.difficulty;

  const prompt = `You are an expert in medical device design, development, and commercialization.

Generate ${count} multiple-choice quiz questions about: "${topic.title}"
Topic description: ${topic.description}
Difficulty level: ${targetDifficulty}

Rules:
- Each question must have exactly 4 answer options
- Questions should test practical, real-world knowledge a med device professional needs
- Cover regulatory, market, clinical, or commercialization nuances relevant to the topic
- Explanations should teach — not just restate the answer

Respond with ONLY a valid JSON array. No markdown, no code fences. Example format:
[
  {
    "question_text": "...",
    "options": ["A", "B", "C", "D"],
    "correct_index": 0,
    "explanation": "...",
    "difficulty": "${targetDifficulty}"
  }
]`;

  const requestBody = {
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  };

  // On web, requests to api.anthropic.com are blocked by CORS.
  // Route through our server-side API proxy instead.
  const response =
    Platform.OS === 'web'
      ? await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        })
      : await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify(requestBody),
        });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  const text = data.content[0].text as string;

  const questions: Omit<Question, 'id'>[] = JSON.parse(text);
  return questions.map((q) => ({ ...q, topic_id: topic.id }));
}
