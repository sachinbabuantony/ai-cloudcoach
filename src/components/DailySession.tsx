import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { generateDailyQuestions, updateQuestionHistory } from '../services/questionService';
import { CheckCircle, XCircle, Loader2, ChevronRight, Trophy } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  topic: string;
}

interface DailySessionProps {
  certificationId: string;
  onComplete: () => void;
}

export function DailySession({ certificationId, onComplete }: DailySessionProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const { user } = useAuth();

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: existingSession } = await supabase
        .from('daily_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('session_date', today)
        .maybeSingle();

      if (existingSession?.completed) {
        onComplete();
        return;
      }

      const loadedQuestions = await generateDailyQuestions(user.id, certificationId);
      setQuestions(loadedQuestions);

      if (existingSession) {
        setSessionId(existingSession.id);
      } else {
        const { data: newSession } = await supabase
          .from('daily_sessions')
          .insert({
            user_id: user.id,
            session_date: today,
            certification_id: certificationId,
            questions_answered: 0,
            correct_answers: 0,
          })
          .select()
          .single();

        setSessionId(newSession?.id || null);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error initializing session:', error);
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (answer: string) => {
    if (showExplanation) return;

    setSelectedAnswer(answer);
    setShowExplanation(true);

    const currentQuestion = questions[currentIndex];
    const isCorrect = answer === currentQuestion.correct_answer;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    }

    if (sessionId && user) {
      await supabase.from('session_answers').insert({
        session_id: sessionId,
        question_id: currentQuestion.id,
        user_answer: answer,
        correct: isCorrect,
        time_spent_seconds: timeSpent,
      });

      await updateQuestionHistory(user.id, currentQuestion.id, isCorrect);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setStartTime(Date.now());
    } else {
      await completeSession();
    }
  };

  const completeSession = async () => {
    if (!sessionId || !user) return;

    try {
      await supabase
        .from('daily_sessions')
        .update({
          questions_answered: questions.length,
          correct_answers: correctCount,
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      const today = new Date().toISOString().split('T')[0];

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        const newStreak = profile.last_session_date === today ? profile.streak_count : profile.streak_count + 1;
        const newLongestStreak = Math.max(newStreak, profile.longest_streak);

        await supabase
          .from('user_profiles')
          .update({
            last_session_date: today,
            streak_count: newStreak,
            longest_streak: newLongestStreak,
            total_questions_answered: profile.total_questions_answered + questions.length,
            total_correct_answers: profile.total_correct_answers + correctCount,
          })
          .eq('id', user.id);
      }

      onComplete();
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your daily questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <p className="text-gray-700">No questions available yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {correctCount} correct
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full mb-4">
              {currentQuestion.topic}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
              {currentQuestion.question_text}
            </h2>
          </div>

          <div className="space-y-3">
            {['A', 'B', 'C', 'D'].map((letter) => {
              const optionText = currentQuestion[`option_${letter.toLowerCase()}` as keyof Question] as string;
              const isSelected = selectedAnswer === letter;
              const isCorrect = letter === currentQuestion.correct_answer;
              const showCorrect = showExplanation && isCorrect;
              const showIncorrect = showExplanation && isSelected && !isCorrect;

              return (
                <button
                  key={letter}
                  onClick={() => handleAnswerSelect(letter)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showCorrect
                      ? 'border-green-500 bg-green-50'
                      : showIncorrect
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      showCorrect
                        ? 'bg-green-500 text-white'
                        : showIncorrect
                        ? 'bg-red-500 text-white'
                        : isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {letter}
                    </span>
                    <span className="flex-1 text-gray-900 leading-relaxed pt-1">
                      {optionText}
                    </span>
                    {showCorrect && <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />}
                    {showIncorrect && <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className={`mt-6 p-4 rounded-xl border-2 ${
              selectedAnswer === currentQuestion.correct_answer
                ? 'bg-green-50 border-green-200'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <h3 className="font-semibold text-gray-900 mb-2">Explanation</h3>
              <p className="text-gray-700 leading-relaxed">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        {showExplanation && (
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {currentIndex < questions.length - 1 ? (
              <>
                Next Question
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Complete Session
                <Trophy className="w-5 h-5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
