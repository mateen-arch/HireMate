import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const AiInterview = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completion, setCompletion] = useState(null);

  useEffect(() => {
    loadInterview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  const loadInterview = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/interviews/questions/${interviewId}`);
      if (response.data.success) {
        setInterview(response.data.interview);
        setQuestions(response.data.questions || []);
        const nextQuestion = response.data.questions.findIndex((q) => !q.answerText);
        setCurrentIndex(nextQuestion === -1 ? 0 : nextQuestion);
        if (response.data.interview.status === 'COMPLETED') {
          setCompletion({ interview: response.data.interview });
        } else {
          setCompletion(null);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load interview');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer');
      return;
    }
    const question = questions[currentIndex];
    if (!question) return;

    try {
      setSubmitting(true);
      await api.post('/interviews/submit-answer', {
        interviewId,
        questionId: question.id,
        answer,
      });
      toast.success('Answer recorded');
      setAnswer('');
      await loadInterview();
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async () => {
    try {
      setSubmitting(true);
      const response = await api.post(`/interviews/complete/${interviewId}`);
      if (response.data.success) {
        toast.success('Interview completed!');
        setCompletion(response.data);
        setInterview(response.data.interview);
        setQuestions(response.data.questions || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to finalize interview');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI interview...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];
  const allAnswered = questions.every((q) => q.answerText);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={() => navigate('/my-applications')}
          className="text-primary-600 font-semibold"
        >
          ← Back to dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-large border border-gray-200 p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm uppercase text-gray-500">Interview for</p>
              <h1 className="text-2xl font-bold text-gray-900">
                {interview?.metadata?.jobTitle || 'Applied role'}
              </h1>
              <p className="text-gray-600">
                {interview?.status === 'COMPLETED'
                  ? 'Interview completed'
                  : 'Answer 5-7 questions. Be clear, concise, and specific.'}
              </p>
            </div>
            <div className="text-sm text-gray-600">
              Question {Math.min(currentIndex + 1, questions.length)} / {questions.length}
            </div>
          </div>

          {completion && (
            <div className="p-6 bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-100">
              <p className="text-sm font-semibold text-primary-600 uppercase">
                Interview completed
              </p>
              <p className="text-4xl font-bold text-gray-900 my-2">
                {completion.application?.aiScore ?? completion.interview?.aiScore ?? '—'}%
              </p>
              <p className="text-gray-600 mb-4">
                Final status:{' '}
                {completion.application?.status?.replace(/_/g, ' ') ||
                  completion.interview?.metadata?.aiOutcome?.replace(/_/g, ' ') ||
                  completion.interview?.status}
              </p>
              <button
                onClick={() => navigate('/my-applications')}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl"
              >
                View application dashboard
              </button>
            </div>
          )}

          {!completion && question && (
            <>
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500 uppercase font-semibold mb-2">
                  Question {currentIndex + 1}
                </p>
                <p className="text-lg text-gray-900">{question.questionText}</p>
              </div>

              <textarea
                rows="8"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500"
                placeholder="Share a structured response that highlights context, action, and impact."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              ></textarea>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={submitting}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl shadow disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : 'Submit answer'}
                </button>
                {allAnswered && (
                  <button
                    onClick={handleComplete}
                    disabled={submitting}
                    className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700"
                  >
                    {submitting ? 'Processing...' : 'Complete interview'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {questions.some((q) => q.answerText) && (
          <div className="bg-white rounded-2xl shadow-large border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transcript</h3>
            <div className="space-y-4">
              {questions
                .filter((q) => q.answerText)
                .map((q) => (
                  <div key={q.id} className="border border-gray-100 rounded-xl p-4">
                    <p className="text-sm text-gray-500 uppercase mb-2">Question</p>
                    <p className="text-gray-900 mb-3">{q.questionText}</p>
                    <p className="text-sm text-gray-500 uppercase mb-2">Your answer</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{q.answerText}</p>
                    {q.score && (
                      <p className="mt-3 text-sm text-gray-600">
                        Score: {q.score}% – relevance {q.breakdown?.relevance} | technical{' '}
                        {q.breakdown?.technicalAccuracy} | communication{' '}
                        {q.breakdown?.communication} | problem-solving{' '}
                        {q.breakdown?.problemSolving}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiInterview;


