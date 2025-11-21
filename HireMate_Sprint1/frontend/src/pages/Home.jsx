import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      <section className="relative pt-20 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 right-10 w-72 h-72 bg-emerald-300/30 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 blur-[110px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="job-card rounded-[32px] p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-white/40 to-transparent pointer-events-none" />
              <div className="relative space-y-6">
                <p className="inline-flex items-center px-4 py-1.5 bg-emerald-100/80 rounded-full text-emerald-700 text-sm font-semibold">
                  🌱 Job Seeker Workspace
                </p>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900">
                  Apply with confidence, track every milestone, and launch AI interviews on demand.
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Personalized recommendations, transparent scoring, and an AI companion that gets you ready for the next interview—no guesswork.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/jobs"
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-emerald-500/40 shadow-lg hover:shadow-emerald-500/60 transition-transform hover:-translate-y-0.5"
                  >
                    Browse Jobs
                  </Link>
                  <Link
                    to="/my-applications"
                    className="px-6 py-3 rounded-2xl border border-emerald-200 text-emerald-700 font-semibold hover:bg-white/70 transition-colors"
                  >
                    Track Applications
                  </Link>
                </div>
                <div className="flex flex-wrap gap-6 pt-4 border-t border-emerald-100/60">
                  {['Instant CV parsing', 'AI interview assistant', 'Real-time status'].map((item) => (
                    <div key={item} className="flex items-center space-x-2 text-sm font-semibold text-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="company-card rounded-[32px] p-10 border border-slate-800/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-900/20 to-transparent pointer-events-none" />
              <div className="relative space-y-6">
                <p className="inline-flex items-center px-4 py-1.5 bg-white/10 rounded-full text-white text-sm font-semibold tracking-wide">
                  🚀 Company Control Center
                </p>
                <h2 className="text-4xl md:text-5xl font-black text-white">
                  Build hiring pipelines, trigger automation, and review AI transcripts in one dashboard.
                </h2>
                <p className="text-lg text-slate-300 leading-relaxed">
                  Move from CV acceptance to AI interview scheduling automatically. Surface top performers with live analytics powered by Chart.js.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/company/qualified"
                    className="px-6 py-3 rounded-2xl bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    View Pipeline
                  </Link>
                  <Link
                    to="/post-job"
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold shadow-violet-500/40 shadow-lg hover:shadow-violet-500/70 transition-transform hover:-translate-y-0.5"
                  >
                    Post a Role
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-sm text-slate-200">
                  <div>
                    <p className="text-3xl font-black text-white">48h</p>
                    <p className="opacity-70">Avg. shortlist time</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">89%</p>
                    <p className="opacity-70">Automation coverage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Two experiences. <span className="text-gradient">One AI brain.</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto">
              Whether you are landing your first interview or building an enterprise hiring flow, HireMate adapts the UI, automation, and notifications to your role.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="job-card rounded-3xl p-8 space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg">
                  👩‍💻
                </span>
                Job Seeker Essentials
              </h3>
              <ul className="space-y-4 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500" />
                  One-click CV uploads with automatic parsing, skills extraction, and qualification scoring.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500" />
                  Applicant dashboard shows every state change, score, and feedback—plus a CTA to launch the AI interviewer.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500" />
                  Real-time notifications via email templates for approval, interview invites, and outcomes.
                </li>
              </ul>
            </div>

            <div className="company-card rounded-3xl p-8 space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white shadow-2xl">
                  🏢
                </span>
                Company Command Deck
              </h3>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-violet-400" />
                  Qualified candidates surface with CV + AI interview scores, transcripts, and access links.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-violet-400" />
                  Hiring pipeline analytics with Chart.js to visualize drop-offs across statuses.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-violet-400" />
                  Automation hooks (N8N/custom script) push status updates to Slack, email, or calendars.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-6">
            {[
              { label: 'Active Jobs', value: '10K+' },
              { label: 'Companies hiring', value: '5K+' },
              { label: 'Successful matches', value: '50K+' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/40 bg-white/70 backdrop-blur-lg p-6 text-center shadow-lg">
                <p className="text-4xl font-black text-slate-900">{stat.value}</p>
                <p className="text-sm uppercase tracking-wide text-slate-500 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="company-card rounded-[32px] p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to run your next recruiting cycle on autopilot?
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-3xl mx-auto">
              Configure your Gemini key, connect the AI virtual interviewer, and let HireMate orchestrate every touch point—from application to human interview.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-900 font-semibold shadow-xl hover:shadow-emerald-400/70 transition-transform hover:-translate-y-0.5"
              >
                Create Job Seeker Account
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 rounded-2xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Register Company
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
