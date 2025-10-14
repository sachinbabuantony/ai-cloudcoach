import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { Flame, Trophy, Target, Calendar, TrendingUp, DollarSign, Loader2, PlayCircle } from 'lucide-react';

interface DashboardProps {
  onStartSession: () => void;
}

export function Dashboard({ onStartSession }: DashboardProps) {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [todaySession, setTodaySession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [certification, setCertification] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [penalties, setPenalties] = useState<any[]>([]);

  useEffect(() => {
    if (profile) {
      loadDashboardData();
    }
  }, [profile]);

  const loadDashboardData = async () => {
    if (!user || !profile) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      const [sessionRes, certRes, recentRes, penaltiesRes] = await Promise.all([
        supabase
          .from('daily_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('session_date', today)
          .maybeSingle(),
        profile.selected_certification_id
          ? supabase
              .from('certifications')
              .select('*')
              .eq('id', profile.selected_certification_id)
              .single()
          : Promise.resolve({ data: null }),
        supabase
          .from('daily_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('session_date', { ascending: false })
          .limit(7),
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .eq('type', 'penalty')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      setTodaySession(sessionRes.data);
      setCertification(certRes.data);
      setRecentSessions(recentRes.data || []);
      setPenalties(penaltiesRes.data || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const canStartToday = !todaySession?.completed;
  const accuracy = profile.total_questions_answered > 0
    ? Math.round((profile.total_correct_answers / profile.total_questions_answered) * 100)
    : 0;

  const totalPenalties = penalties.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">CloudCert Mastery</h1>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h2>
          {certification && (
            <p className="text-gray-600">
              Studying for <span className="font-semibold text-blue-600">{certification.name}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <Flame className="w-8 h-8" />
              <span className="text-sm font-semibold opacity-90">Current Streak</span>
            </div>
            <p className="text-4xl font-bold">{profile.streak_count}</p>
            <p className="text-sm opacity-90 mt-1">days in a row</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-8 h-8" />
              <span className="text-sm font-semibold opacity-90">Best Streak</span>
            </div>
            <p className="text-4xl font-bold">{profile.longest_streak}</p>
            <p className="text-sm opacity-90 mt-1">days total</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-8 h-8" />
              <span className="text-sm font-semibold opacity-90">Accuracy</span>
            </div>
            <p className="text-4xl font-bold">{accuracy}%</p>
            <p className="text-sm opacity-90 mt-1">
              {profile.total_correct_answers} / {profile.total_questions_answered} correct
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-8 h-8" />
              <span className="text-sm font-semibold opacity-90">Total Days</span>
            </div>
            <p className="text-4xl font-bold">{recentSessions.length}</p>
            <p className="text-sm opacity-90 mt-1">sessions completed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Today's Session</h3>
              {canStartToday ? (
                <div>
                  <p className="text-gray-600 mb-6">
                    Complete your daily 10 questions to maintain your streak and build expertise.
                  </p>
                  <button
                    onClick={onStartSession}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <PlayCircle className="w-6 h-6" />
                    Start Today's Session
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Trophy className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Session Complete!
                  </h4>
                  <p className="text-gray-600 mb-4">
                    You've completed today's session. Come back tomorrow for more questions!
                  </p>
                  {todaySession && (
                    <div className="inline-flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-lg">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {todaySession.correct_answers}/{todaySession.questions_answered}
                        </p>
                        <p className="text-xs text-gray-600">correct</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {Math.round((todaySession.correct_answers / todaySession.questions_answered) * 100)}%
                        </p>
                        <p className="text-xs text-gray-600">accuracy</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentSessions.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {new Date(session.session_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.correct_answers}/{session.questions_answered} correct
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round((session.correct_answers / session.questions_answered) * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
                {recentSessions.length === 0 && (
                  <p className="text-gray-600 text-center py-4">
                    No sessions yet. Start your first session today!
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                Commitment Tracking
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>30-Day Goal Progress</strong>
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                        style={{ width: `${Math.min((profile.streak_count / 30) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {profile.streak_count}/30
                    </span>
                  </div>
                </div>

                {penalties.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Penalties Paid
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      £{totalPenalties.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {penalties.length} missed day{penalties.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-700">
                    <strong>Complete 30 days</strong> to get all penalties refunded!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-3">How It Works</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>• Answer 10 questions daily</li>
                <li>• Build your streak consistently</li>
                <li>• Miss a day = £0.50 penalty</li>
                <li>• 30-day streak = full refund!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
