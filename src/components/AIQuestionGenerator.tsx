import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { generateQuestionsWithAI, generateSyllabus, generateTopicQuestions } from '../services/aiQuestionGenerator';
import { Sparkles, Loader2, CheckCircle, AlertCircle, List, Zap } from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  code: string;
}

export function AIQuestionGenerator() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState(2);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [generatedCount, setGeneratedCount] = useState(0);
  const [syllabus, setSyllabus] = useState<string[]>([]);
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    setLoading(true);
    const { data } = await supabase.from('certifications').select('id, name, code').eq('active', true);
    if (data) setCertifications(data);
    setLoading(false);
  };

  const handleGenerateSyllabus = async () => {
    if (!selectedCert) return;

    setLoadingSyllabus(true);
    setError('');
    setSyllabus([]);

    try {
      const topics = await generateSyllabus(selectedCert.name, selectedCert.code);
      setSyllabus(topics);
      setSuccess(`Generated ${topics.length} topics for syllabus`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(`Failed to generate syllabus: ${err.message}`);
    } finally {
      setLoadingSyllabus(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!selectedCert || !topic.trim()) {
      setError('Please select a certification and enter a topic');
      return;
    }

    setGenerating(true);
    setError('');
    setSuccess('');
    setGeneratedCount(0);

    try {
      const questions = await generateQuestionsWithAI(
        selectedCert.name,
        selectedCert.code,
        topic,
        count,
        difficulty
      );

      for (const q of questions) {
        await supabase.from('questions').insert({
          certification_id: selectedCert.id,
          ...q,
          approved: true,
        });
        setGeneratedCount((prev) => prev + 1);
      }

      setSuccess(`Successfully generated and saved ${questions.length} questions!`);
      setTopic('');
      setTimeout(() => {
        setSuccess('');
        setGeneratedCount(0);
      }, 5000);
    } catch (err: any) {
      setError(`Failed to generate questions: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateAllTopics = async () => {
    if (!selectedCert || syllabus.length === 0) {
      setError('Please generate a syllabus first');
      return;
    }

    setGenerating(true);
    setError('');
    setSuccess('');
    setGeneratedCount(0);

    try {
      let totalGenerated = 0;

      for (const topic of syllabus) {
        const questions = await generateQuestionsWithAI(
          selectedCert.name,
          selectedCert.code,
          topic,
          5,
          Math.floor(Math.random() * 3) + 2
        );

        for (const q of questions) {
          await supabase.from('questions').insert({
            certification_id: selectedCert.id,
            ...q,
            approved: true,
          });
          totalGenerated++;
          setGeneratedCount(totalGenerated);
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      setSuccess(`Successfully generated ${totalGenerated} questions across ${syllabus.length} topics!`);
      setSyllabus([]);
      setTimeout(() => {
        setSuccess('');
        setGeneratedCount(0);
      }, 5000);
    } catch (err: any) {
      setError(`Failed to generate questions: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Question Generator</h1>
              <p className="text-gray-600">Generate certification questions using AI</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Certification
              </label>
              <select
                value={selectedCert?.id || ''}
                onChange={(e) => {
                  const cert = certifications.find((c) => c.id === e.target.value);
                  setSelectedCert(cert || null);
                  setSyllabus([]);
                }}
                disabled={loading || generating}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Choose a certification</option>
                {certifications.map((cert) => (
                  <option key={cert.id} value={cert.id}>
                    {cert.code} - {cert.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCert && (
              <>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <List className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Generate Syllabus</h3>
                    </div>
                    <button
                      onClick={handleGenerateSyllabus}
                      disabled={loadingSyllabus || generating}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {loadingSyllabus ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      Generate Topics
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    AI will generate a comprehensive list of topics for this certification
                  </p>

                  {syllabus.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold text-gray-900">
                          Generated {syllabus.length} topics:
                        </p>
                        <button
                          onClick={handleGenerateAllTopics}
                          disabled={generating}
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          {generating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Zap className="w-4 h-4" />
                          )}
                          Generate All (5 per topic)
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                        {syllabus.map((topic, idx) => (
                          <div key={idx} className="bg-white px-3 py-2 rounded-lg text-sm text-gray-700 border border-purple-100">
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Or Generate for Specific Topic</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Topic Name
                      </label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        disabled={generating}
                        placeholder="e.g., EC2 Instances, Azure Storage, BigQuery"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Questions
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value))}
                        disabled={generating}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty Level (1-5)
                      </label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(parseInt(e.target.value))}
                        disabled={generating}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="1">1 - Beginner</option>
                        <option value="2">2 - Easy</option>
                        <option value="3">3 - Intermediate</option>
                        <option value="4">4 - Advanced</option>
                        <option value="5">5 - Expert</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateQuestions}
                    disabled={generating || !topic.trim()}
                    className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Generating... ({generatedCount} saved)
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        Generate Questions with AI
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {success && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="font-bold text-lg mb-3">How it works</h3>
          <ul className="space-y-2 text-sm opacity-90">
            <li>• Select a certification to generate questions for</li>
            <li>• Generate a complete syllabus with AI-suggested topics</li>
            <li>• Bulk generate 5 questions per topic automatically</li>
            <li>• Or manually specify a topic and generate custom questions</li>
            <li>• All questions include detailed explanations</li>
            <li>• Questions are automatically approved and ready to use</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
