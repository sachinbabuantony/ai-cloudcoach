const OPENROUTER_API_KEY = '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';

interface GeneratedQuestion {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty_level: number;
  topic: string;
}

export async function generateQuestionsWithAI(
  certificationName: string,
  certificationCode: string,
  topic: string,
  count: number = 10,
  difficultyLevel: number = 2
): Promise<GeneratedQuestion[]> {
  const prompt = `Generate ${count} multiple-choice questions for the ${certificationName} (${certificationCode}) certification exam.

Topic: ${topic}
Difficulty Level: ${difficultyLevel}/5 (1=beginner, 5=expert)

Requirements:
- Each question must have 4 options (A, B, C, D)
- Only one correct answer
- Include detailed explanations for the correct answer
- Questions should be realistic and based on actual exam content
- Cover different aspects of the topic
- Vary the question types (conceptual, scenario-based, best practice)

Return the response as a JSON array with this exact structure:
[
  {
    "question_text": "Question here?",
    "option_a": "First option",
    "option_b": "Second option",
    "option_c": "Third option",
    "option_d": "Fourth option",
    "correct_answer": "A",
    "explanation": "Detailed explanation of why this is correct and why others are wrong",
    "difficulty_level": ${difficultyLevel},
    "topic": "${topic}"
  }
]

Generate questions now:`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from AI response');
    }

    const questions: GeneratedQuestion[] = JSON.parse(jsonMatch[0]);
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}

export async function generateSyllabus(
  certificationName: string,
  certificationCode: string
): Promise<string[]> {
  const prompt = `Generate a comprehensive syllabus/topic list for the ${certificationName} (${certificationCode}) certification exam.

Return a JSON array of topic names that cover the entire exam content. Topics should be:
- Specific and exam-relevant
- Cover all major domains
- 15-25 topics total
- Ordered by importance/exam weight

Example format:
["IAM and Security", "EC2 Instances", "S3 Storage", ...]

Generate the syllabus now:`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from AI response');
    }

    const topics: string[] = JSON.parse(jsonMatch[0]);
    return topics;
  } catch (error) {
    console.error('Error generating syllabus:', error);
    throw error;
  }
}

export async function generateTopicQuestions(
  certificationName: string,
  certificationCode: string,
  topics: string[],
  questionsPerTopic: number = 5
): Promise<{ topic: string; questions: GeneratedQuestion[] }[]> {
  const results: { topic: string; questions: GeneratedQuestion[] }[] = [];

  for (const topic of topics) {
    try {
      const questions = await generateQuestionsWithAI(
        certificationName,
        certificationCode,
        topic,
        questionsPerTopic,
        Math.floor(Math.random() * 3) + 2
      );

      results.push({ topic, questions });

      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error generating questions for topic ${topic}:`, error);
    }
  }

  return results;
}
