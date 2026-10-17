'use client';

import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  Star, 
  MessageSquare, 
  Clock, 
  User, 
  Send,
  Trash2,
  ExternalLink,
  Award,
  FileText
} from 'lucide-react';
import { Candidate, Stage } from '@/types/ats';
import { STAGES } from '@/lib/constants';

interface CandidateModalProps {
  candidate: Candidate | null;
  onClose: () => void;
  onUpdateStage: (candidateId: string, newStage: Stage) => void;
  onAddNote: (candidateId: string, text: string, author: string, role: string, rating?: number) => void;
  onDeleteCandidate: (candidateId: string) => void;
  onOpenEmailModal: (candidate: Candidate) => void;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  candidate,
  onClose,
  onUpdateStage,
  onAddNote,
  onDeleteCandidate,
  onOpenEmailModal,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'history'>('overview');
  
  // Note form state
  const [noteText, setNoteText] = useState('');
  const [authorName, setAuthorName] = useState('Hiring Manager');
  const [authorRole, setAuthorRole] = useState('Engineering Team');
  const [noteRating, setNoteRating] = useState<number>(5);

  if (!candidate) return null;

  const currentStageConfig = STAGES.find((s) => s.id === candidate.stage);

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    onAddNote(candidate.id, noteText.trim(), authorName.trim(), authorRole.trim(), noteRating);
    setNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-zinc-50 via-zinc-100 to-indigo-50/40 dark:from-zinc-900 dark:via-zinc-800 dark:to-indigo-950/30 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-start justify-between gap-4">
            
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                {candidate.name.charAt(0)}
              </div>
              
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                    {candidate.name}
                  </h2>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      currentStageConfig?.color.badge || 'bg-zinc-100 text-zinc-800'
                    }`}
                  >
                    {currentStageConfig?.label}
                  </span>
                </div>
                
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mt-0.5">
                  {candidate.role} • <span className="text-zinc-400">{candidate.department}</span>
                </p>

                {/* Quick Contact Chips */}
                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-zinc-600 dark:text-zinc-400">
                  <a
                    href={`mailto:${candidate.email}`}
                    className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{candidate.email}</span>
                  </a>
                  <a
                    href={`tel:${candidate.phone}`}
                    className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{candidate.phone}</span>
                  </a>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{candidate.location}</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-2 border-t border-zinc-200/70 dark:border-zinc-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl transition ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Overview & Resume
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
                activeTab === 'notes'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Scorecard & Notes</span>
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-200 dark:bg-zinc-700 text-[10px]">
                {candidate.notes.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Stage History</span>
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-200 dark:bg-zinc-700 text-[10px]">
                {candidate.stageHistory.length}
              </span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 max-h-[55vh] overflow-y-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Summary / Bio */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span>Executive Resume Summary</span>
                </h4>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {candidate.resumeSummary}
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
                  <span className="text-xs text-zinc-400 font-semibold uppercase">Experience</span>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">
                    {candidate.experienceYears === 0
                      ? 'Fresher / Recent Graduate'
                      : `${candidate.experienceYears} Years Industry Experience`}
                  </p>
                  {candidate.currentCompany && (
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Current: {candidate.currentCompany}
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
                  <span className="text-xs text-zinc-400 font-semibold uppercase">Expected Stipend / Salary</span>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">
                    {candidate.expectedSalary}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Location: {candidate.location}
                  </p>
                </div>

                {candidate.education && (
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 sm:col-span-2">
                    <span className="text-xs text-zinc-400 font-semibold uppercase">Education</span>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">
                      {candidate.education}
                    </p>
                  </div>
                )}
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-500" />
                  <span>Technical & Domain Skills</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: NOTES & SCORECARD */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              
              {/* Add Note Form */}
              <form onSubmit={handleSubmitNote} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  <span>Submit Interview Scorecard & Feedback</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                      Evaluator Name
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                      Role / Department
                    </label>
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                      Score Rating (1-5 ⭐)
                    </label>
                    <select
                      value={noteRating}
                      onChange={(e) => setNoteRating(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (Strong Hire)</option>
                      <option value="4">⭐⭐⭐⭐ (Hire)</option>
                      <option value="3">⭐⭐⭐ (Average / In Review)</option>
                      <option value="2">⭐⭐ (Needs Improvement)</option>
                      <option value="1">⭐ (No Hire)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                    Feedback & Technical Evaluation
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Candidate demonstrated clean code structure, solid understanding of REST APIs and React lifecycle..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Scorecard Note</span>
                  </button>
                </div>
              </form>

              {/* Notes List */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Previous Feedback ({candidate.notes.length})
                </h5>

                {candidate.notes.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">
                    No notes recorded yet. Add the first interview scorecard above.
                  </p>
                ) : (
                  candidate.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-zinc-900 dark:text-white">
                            {note.author}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            • {note.role}
                          </span>
                        </div>
                        {note.rating && (
                          <div className="flex items-center gap-1 text-amber-500 font-mono text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{note.rating} / 5</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {note.text}
                      </p>
                      <span className="block mt-2 text-[10px] text-zinc-400 font-mono">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 3: STAGE HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Stage Progression Timeline</span>
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
                {candidate.stageHistory.map((item, index) => {
                  const stageConfig = STAGES.find((s) => s.id === item.stage);
                  return (
                    <div key={index} className="relative">
                      <div
                        className="absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-900"
                        style={{ backgroundColor: stageConfig?.color.accent || '#6366f1' }}
                      />
                      <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-zinc-900 dark:text-white">
                            {stageConfig?.label}
                          </span>
                          <span className="font-mono text-zinc-400 text-[11px]">
                            {new Date(item.changedAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Updated by <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.changedBy}</span>
                          {item.note && ` — "${item.note}"`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Stage Progression Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Stage:
            </span>
            <select
              value={candidate.stage}
              onChange={(e) => onUpdateStage(candidate.id, e.target.value as Stage)}
              className="py-1.5 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Email Candidate */}
            <button
              onClick={() => onOpenEmailModal(candidate)}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Communication</span>
            </button>

            {/* Delete Candidate */}
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${candidate.name}?`)) {
                  onDeleteCandidate(candidate.id);
                  onClose();
                }
              }}
              className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-100 transition"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
