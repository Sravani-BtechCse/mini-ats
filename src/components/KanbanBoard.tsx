'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Star, 
  ChevronRight, 
  ChevronLeft, 
  MoreHorizontal, 
  Building2, 
  MapPin, 
  Calendar,
  Briefcase,
  Search,
  Filter,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Candidate, Stage } from '@/types/ats';
import { STAGES, DEPARTMENTS } from '@/lib/constants';

interface KanbanBoardProps {
  candidates: Candidate[];
  onUpdateStage: (candidateId: string, newStage: Stage) => void;
  onSelectCandidate: (candidate: Candidate) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  candidates,
  onUpdateStage,
  onSelectCandidate,
  searchQuery,
  setSearchQuery,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);

  // Filter candidates for Kanban
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDept === 'all' || c.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  // Handle stage change with celebration effect if hired/offer
  const handleStageChange = (candidateId: string, newStage: Stage) => {
    if (newStage === 'hired' || newStage === 'offer') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.error(e);
      }
    }
    onUpdateStage(candidateId, newStage);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedCandidateId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: Stage) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('text/plain') || draggedCandidateId;
    if (candidateId) {
      handleStageChange(candidateId, targetStage);
    }
    setDraggedCandidateId(null);
  };

  return (
    <div className="space-y-4">
      {/* Kanban Filter & Search Sub-header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-800/80 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search candidate, role, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Drag candidate cards across columns or use quick stage selector</span>
        </div>
      </div>

      {/* Kanban Columns Horizontal Scroll Area */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1300px] items-start">
          {STAGES.map((stageConfig) => {
            const stageCandidates = filteredCandidates.filter((c) => c.stage === stageConfig.id);

            return (
              <div
                key={stageConfig.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stageConfig.id)}
                className="w-80 shrink-0 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-3 flex flex-col max-h-[calc(100vh-220px)] transition-all"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-200/60 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stageConfig.color.accent }}
                    />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                      {stageConfig.label}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700 shadow-2xs">
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards List */}
                <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 min-h-[150px]">
                  {stageCandidates.length === 0 ? (
                    <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-6 text-center text-xs text-zinc-400 flex flex-col items-center justify-center min-h-[120px]">
                      <span>Drop candidates here</span>
                    </div>
                  ) : (
                    stageCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, candidate.id)}
                        onClick={() => onSelectCandidate(candidate)}
                        className="group bg-white dark:bg-zinc-800 rounded-xl p-3.5 border border-zinc-200/90 dark:border-zinc-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-2xs hover:shadow-md cursor-grab active:cursor-grabbing transition-all select-none"
                      >
                        {/* Top: Name & Rating */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {candidate.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate max-w-[150px]">
                                {candidate.name}
                              </h4>
                              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[150px]">
                                {candidate.role}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-[11px] font-bold font-mono">
                              {candidate.rating}
                            </span>
                          </div>
                        </div>

                        {/* Experience & Department */}
                        <div className="mt-2.5 flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium">
                            {candidate.experienceYears === 0
                              ? 'Fresher'
                              : `${candidate.experienceYears} yr exp`}
                          </span>
                          <span className="truncate">{candidate.department}</span>
                        </div>

                        {/* Skills Chips */}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-50 dark:bg-zinc-700/60 text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="text-[10px] px-1 py-0.5 text-zinc-400">
                              +{candidate.skills.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Card Footer: Quick Stage Selector */}
                        <div
                          className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-700/60 flex items-center justify-between"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {new Date(candidate.appliedDate).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>

                          <select
                            value={candidate.stage}
                            onChange={(e) =>
                              handleStageChange(candidate.id, e.target.value as Stage)
                            }
                            className="text-[11px] py-1 px-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 border-none font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                          >
                            {STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                Move to {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
