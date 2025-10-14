import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Award, CheckCircle, Loader2, Cloud } from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  provider: string;
  code: string;
  description: string;
}

interface CertificationSelectorProps {
  onComplete: () => void;
}

export function CertificationSelector({ onComplete }: CertificationSelectorProps) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('active', true)
        .order('provider', { ascending: true });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error) {
      console.error('Error loading certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedId || !user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ selected_certification_id: selectedId })
        .eq('id', user.id);

      if (error) throw error;
      onComplete();
    } catch (error) {
      console.error('Error saving certification:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'aws':
        return 'from-orange-500 to-yellow-500';
      case 'azure':
        return 'from-blue-500 to-cyan-500';
      case 'google cloud':
        return 'from-red-500 to-yellow-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4">
            <Cloud className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Choose Your Certification
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the cloud certification you want to master. You'll receive 10 personalized questions daily to build expertise through consistent practice.
          </p>
        </div>

        <div className="grid gap-4 mb-8">
          {certifications.map((cert) => (
            <button
              key={cert.id}
              onClick={() => setSelectedId(cert.id)}
              className={`relative bg-white rounded-xl p-6 text-left transition-all border-2 ${
                selectedId === cert.id
                  ? 'border-blue-500 shadow-lg scale-[1.02]'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${getProviderColor(cert.provider)} flex items-center justify-center shadow-lg`}>
                  <Award className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full mb-2">
                        {cert.provider}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {cert.name}
                      </h3>
                      <p className="text-sm font-mono text-gray-500 mb-2">
                        {cert.code}
                      </p>
                    </div>

                    {selectedId === cert.id && (
                      <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            How it works
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Answer 10 questions daily tailored to your selected certification</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Build your streak by completing sessions every day</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>Miss a day? Pay £0.50 as accountability</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span>Complete 30 days and get all penalties refunded!</span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedId || submitting}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {submitting ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Start Learning
            </>
          )}
        </button>
      </div>
    </div>
  );
}
