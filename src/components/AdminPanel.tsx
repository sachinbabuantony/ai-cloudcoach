import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database, Plus, Loader2, CheckCircle } from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  code: string;
}

export function AdminPanel() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [selectedCert, setSelectedCert] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    explanation: '',
    difficulty_level: 2,
    topic: '',
  });

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    const { data } = await supabase.from('certifications').select('id, name, code').eq('active', true);
    if (data) setCertifications(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      const { error } = await supabase.from('questions').insert({
        certification_id: selectedCert,
        ...formData,
        approved: true,
      });

      if (error) throw error;

      setSuccess('Question added successfully!');
      setFormData({
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: 'A',
        explanation: '',
        difficulty_level: 2,
        topic: '',
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error adding question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Add Question</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certification
              </label>
              <select
                value={selectedCert}
                onChange={(e) => setSelectedCert(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a certification</option>
                {certifications.map((cert) => (
                  <option key={cert.id} value={cert.id}>
                    {cert.code} - {cert.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                required
                placeholder="e.g., Storage, Compute, Networking"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text
              </label>
              <textarea
                value={formData.question_text}
                onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Option A
                </label>
                <input
                  type="text"
                  value={formData.option_a}
                  onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Option B
                </label>
                <input
                  type="text"
                  value={formData.option_b}
                  onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Option C
                </label>
                <input
                  type="text"
                  value={formData.option_c}
                  onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Option D
                </label>
                <input
                  type="text"
                  value={formData.option_d}
                  onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer
                </label>
                <select
                  value={formData.correct_answer}
                  onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.difficulty_level}
                  onChange={(e) =>
                    setFormData({ ...formData, difficulty_level: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explanation
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add Question
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
