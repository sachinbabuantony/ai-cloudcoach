import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useProfile } from './hooks/useProfile';
import { AuthForm } from './components/AuthForm';
import { CertificationSelector } from './components/CertificationSelector';
import { Dashboard } from './components/Dashboard';
import { DailySession } from './components/DailySession';
import { AIQuestionGenerator } from './components/AIQuestionGenerator';
import { AdminPanel } from './components/AdminPanel';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, refreshProfile } = useProfile();
  const [view, setView] = useState<'dashboard' | 'session' | 'ai-generator' | 'admin'>('dashboard');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'ai') {
      setView('ai-generator');
    } else if (params.get('admin') === 'manual') {
      setView('admin');
    }
  }, []);

  useEffect(() => {
    if (profile) {
      const params = new URLSearchParams(window.location.search);
      if (!params.get('admin')) {
        setView('dashboard');
      }
    }
  }, [profile]);

  if (view === 'ai-generator') {
    return <AIQuestionGenerator />;
  }

  if (view === 'admin') {
    return <AdminPanel />;
  }

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  if (!profile?.selected_certification_id) {
    return <CertificationSelector onComplete={refreshProfile} />;
  }

  if (view === 'session') {
    return (
      <DailySession
        certificationId={profile.selected_certification_id}
        onComplete={() => {
          refreshProfile();
          setView('dashboard');
        }}
      />
    );
  }

  return (
    <Dashboard
      onStartSession={() => setView('session')}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
