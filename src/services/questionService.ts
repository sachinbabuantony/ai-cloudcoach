import { supabase } from '../lib/supabase';

interface Question {
  id: string;
  certification_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  difficulty_level: number;
  topic: string;
}

interface UserQuestionHistory {
  question_id: string;
  times_seen: number;
  times_correct: number;
  mastery_level: number;
}

export async function generateDailyQuestions(
  userId: string,
  certificationId: string
): Promise<Question[]> {
  const { data: history } = await supabase
    .from('user_question_history')
    .select('question_id, times_seen, times_correct, mastery_level')
    .eq('user_id', userId);

  const historyMap = new Map<string, UserQuestionHistory>();
  history?.forEach((h) => {
    historyMap.set(h.question_id, h);
  });

  const { data: allQuestions } = await supabase
    .from('questions')
    .select('*')
    .eq('certification_id', certificationId)
    .eq('approved', true);

  if (!allQuestions || allQuestions.length === 0) {
    return [];
  }

  const scoredQuestions = allQuestions.map((q) => {
    const hist = historyMap.get(q.id);
    let score = 0;

    if (!hist) {
      score = 100;
    } else {
      const successRate = hist.times_seen > 0 ? hist.times_correct / hist.times_seen : 0;
      const masteryScore = 100 - hist.mastery_level;
      const recencyBonus = 20;

      score = masteryScore * 0.6 + (1 - successRate) * 30 + recencyBonus;
    }

    return { question: q, score };
  });

  scoredQuestions.sort((a, b) => b.score - a.score);

  const selectedQuestions: Question[] = [];
  const topCandidates = scoredQuestions.slice(0, Math.min(30, scoredQuestions.length));

  for (let i = 0; i < Math.min(10, topCandidates.length); i++) {
    const randomIndex = Math.floor(Math.random() * Math.min(15, topCandidates.length - i));
    const selected = topCandidates.splice(randomIndex, 1)[0];
    selectedQuestions.push(selected.question);
  }

  while (selectedQuestions.length < 10 && allQuestions.length >= 10) {
    const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
    if (!selectedQuestions.find((q) => q.id === randomQuestion.id)) {
      selectedQuestions.push(randomQuestion);
    }
  }

  return selectedQuestions.slice(0, 10);
}

export async function updateQuestionHistory(
  userId: string,
  questionId: string,
  correct: boolean
): Promise<void> {
  const { data: existing } = await supabase
    .from('user_question_history')
    .select('*')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .maybeSingle();

  if (existing) {
    const newTimesSeen = existing.times_seen + 1;
    const newTimesCorrect = existing.times_correct + (correct ? 1 : 0);
    const successRate = newTimesCorrect / newTimesSeen;
    const newMasteryLevel = Math.min(100, Math.floor(successRate * 100 + newTimesSeen * 2));

    await supabase
      .from('user_question_history')
      .update({
        times_seen: newTimesSeen,
        times_correct: newTimesCorrect,
        last_seen_at: new Date().toISOString(),
        mastery_level: newMasteryLevel,
      })
      .eq('id', existing.id);
  } else {
    await supabase.from('user_question_history').insert({
      user_id: userId,
      question_id: questionId,
      times_seen: 1,
      times_correct: correct ? 1 : 0,
      mastery_level: correct ? 20 : 0,
    });
  }

  await supabase.rpc('increment', {
    table_name: 'questions',
    column_name: 'times_answered',
    row_id: questionId,
  }).catch(() => {
    supabase
      .from('questions')
      .update({
        times_answered: supabase.sql`times_answered + 1`,
        times_correct: correct ? supabase.sql`times_correct + 1` : supabase.sql`times_correct`,
      })
      .eq('id', questionId);
  });
}
