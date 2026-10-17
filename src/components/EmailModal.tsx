'use client';

import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2, Sparkles, Copy } from 'lucide-react';
import { Candidate } from '@/types/ats';

interface EmailModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ candidate, isOpen, onClose }) => {
  const [template, setTemplate] = useState<'interview' | 'offer' | 'rejection'>('interview');
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !candidate) return null;

  const templates = {
    interview: {
      subject: `Interview Invitation: ${candidate.role} at EarlyJobs.ai`,
      body: `Hi ${candidate.name},

Thank you for applying for the ${candidate.role} position at EarlyJobs.ai.

We were impressed by your profile, particularly your hands-on experience with ${candidate.skills.slice(0, 3).join(', ')}. We would love to invite you for a 45-minute technical discussion with our engineering team.

Please let us know your availability over the next 2-3 days.

Best regards,
EarlyJobs.ai Recruitment Team
Bengaluru Office`,
    },
    offer: {
      subject: `Offer Letter: ${candidate.role} — EarlyJobs.ai`,
      body: `Dear ${candidate.name},

Congratulations! On behalf of EarlyJobs.ai, we are thrilled to extend an offer for the ${candidate.role} position at our Bengaluru office.

Stipend / Compensation: ${candidate.expectedSalary}
Duration: 6 Months
Location: Bengaluru, Karnataka

We believe your technical foundation and passion will make a tremendous impact on our engineering roadmap. Please review and reply with your acceptance.

Warm regards,
CTO & Hiring Team
EarlyJobs.ai`,
    },
    rejection: {
      subject: `Update on your application at EarlyJobs.ai`,
      body: `Hi ${candidate.name},

Thank you for your interest in EarlyJobs.ai and for taking the time to share your application for the ${candidate.role} role.

While your profile is impressive, we have decided to move forward with candidates whose current experience more closely matches our immediate project needs. We will keep your resume on file for future openings.

We wish you the very best in your career!

Sincerely,
EarlyJobs.ai Talent Team`,
    },
  };

  const currentTemplate = templates[template];

  const handleSend = () => {
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 1600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${currentTemplate.subject}\n\n${currentTemplate.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-zinc-900 dark:to-indigo-950/40 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Candidate Communication
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                To: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{candidate.name}</span> ({candidate.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Template Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
              Select Email Template
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemplate('interview')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  template === 'interview'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                📅 Interview Invite
              </button>

              <button
                type="button"
                onClick={() => setTemplate('offer')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  template === 'offer'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                🎉 Offer Letter
              </button>

              <button
                type="button"
                onClick={() => setTemplate('rejection')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  template === 'rejection'
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                ✉️ Status Update
              </button>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              Subject Line
            </label>
            <input
              type="text"
              readOnly
              value={currentTemplate.subject}
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-white"
            />
          </div>

          {/* Email Body */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Email Message Body
              </label>
              <button
                onClick={handleCopy}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
            <textarea
              rows={8}
              readOnly
              value={currentTemplate.body}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-[11px] text-zinc-400">
            Simulates automated notification dispatch
          </span>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSend}
              disabled={isSent}
              className={`px-5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition ${
                isSent
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
              }`}
            >
              {isSent ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Email Sent!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Communication</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
