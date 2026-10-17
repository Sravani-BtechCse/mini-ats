'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Mail, 
  ExternalLink, 
  Star, 
  ArrowUpDown,
  Download,
  RotateCcw,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Candidate, Stage } from '@/types/ats';
import { STAGES, DEPARTMENTS, AVAILABLE_ROLES } from '@/lib/constants';

interface CandidateTableProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onUpdateStage: (candidateId: string, newStage: Stage) => void;
  onDeleteCandidate: (candidateId: string) => void;
  onOpenEmailModal: (candidate: Candidate) => void;
  onExportCsv: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const CandidateTable: React.FC<CandidateTableProps> = ({
  candidates,
  onSelectCandidate,
  onUpdateStage,
  onDeleteCandidate,
  onOpenEmailModal,
  onExportCsv,
  searchQuery,
  setSearchQuery,
}) => {
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [minExpFilter, setMinExpFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'experience'>('newest');

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    let result = [...candidates];

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Stage
    if (stageFilter !== 'all') {
      result = result.filter((c) => c.stage === stageFilter);
    }

    // Department
    if (deptFilter !== 'all') {
      result = result.filter((c) => c.department === deptFilter);
    }

    // Role
    if (roleFilter !== 'all') {
      result = result.filter((c) => c.role === roleFilter);
    }

    // Min Experience
    if (minExpFilter !== 'all') {
      result = result.filter((c) => c.experienceYears >= minExpFilter);
    }

    // Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime());
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'experience') {
      result.sort((a, b) => b.experienceYears - a.experienceYears);
    }

    return result;
  }, [candidates, searchQuery, stageFilter, deptFilter, roleFilter, minExpFilter, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setStageFilter('all');
    setDeptFilter('all');
    setRoleFilter('all');
    setMinExpFilter('all');
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    stageFilter !== 'all' ||
    deptFilter !== 'all' ||
    roleFilter !== 'all' ||
    minExpFilter !== 'all' ||
    sortBy !== 'newest';

  return (
    <div className="space-y-4">
      {/* Filtering & Search Controls Bar */}
      <div className="bg-white dark:bg-zinc-800/80 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search candidate by name, email, role, or technical skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Export CSV button */}
            <button
              onClick={onExportCsv}
              className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-700/60 text-xs">
          
          {/* Stage Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              Hiring Stage
            </label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Stages ({candidates.length})</option>
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({candidates.filter((c) => c.stage === s.id).length})
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              Department
            </label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              Target Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 truncate"
            >
              <option value="all">All Roles</option>
              {AVAILABLE_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Min Experience */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              Experience Level
            </label>
            <select
              value={minExpFilter.toString()}
              onChange={(e) =>
                setMinExpFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))
              }
              className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">Any Experience</option>
              <option value="0">Freshers / Interns</option>
              <option value="1">1+ Years</option>
              <option value="2">2+ Years</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              Sort Candidates
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="newest">Newest Applied First</option>
              <option value="oldest">Oldest Applied First</option>
              <option value="rating">Highest Rated</option>
              <option value="experience">Most Experience</option>
            </select>
          </div>

        </div>
      </div>

      {/* Candidates Data Table */}
      <div className="bg-white dark:bg-zinc-800/80 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700/60 bg-zinc-50/70 dark:bg-zinc-900/40 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Role & Dept</th>
                <th className="py-3.5 px-4">Stage</th>
                <th className="py-3.5 px-4">Experience & Location</th>
                <th className="py-3.5 px-4">Key Skills</th>
                <th className="py-3.5 px-4 text-center">Score</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700/50 text-xs">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <p className="font-semibold text-sm text-zinc-600 dark:text-zinc-300">
                      No candidates match your filters
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Try clearing filters or searching with different keywords.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold text-xs"
                    >
                      Clear All Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => {
                  const stageConfig = STAGES.find((s) => s.id === candidate.stage);

                  return (
                    <tr
                      key={candidate.id}
                      onClick={() => onSelectCandidate(candidate)}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-700/30 transition-colors cursor-pointer group"
                    >
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {candidate.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                              {candidate.name}
                            </span>
                            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                              {candidate.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Dept */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {candidate.role}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {candidate.department}
                        </div>
                      </td>

                      {/* Stage Dropdown */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={candidate.stage}
                          onChange={(e) =>
                            onUpdateStage(candidate.id, e.target.value as Stage)
                          }
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border-none cursor-pointer transition ${
                            stageConfig?.color.badge || 'bg-zinc-100 text-zinc-800'
                          }`}
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Experience & Location */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-zinc-800 dark:text-zinc-200">
                          {candidate.experienceYears === 0
                            ? 'Fresher'
                            : `${candidate.experienceYears} Years`}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[130px]">
                          {candidate.location}
                        </div>
                      </td>

                      {/* Skills */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {candidate.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="text-[10px] text-zinc-400 font-mono self-center">
                              +{candidate.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Score / Rating */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 font-mono font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{candidate.rating}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenEmailModal(candidate)}
                            title="Send Email / Interview Invite"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onSelectCandidate(candidate)}
                            title="View Full Profile & Notes"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteCandidate(candidate.id)}
                            title="Delete Candidate"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-700/60 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            Showing <strong>{filteredCandidates.length}</strong> of{' '}
            <strong>{candidates.length}</strong> total applicants
          </span>
          <span className="font-mono">
            {Math.round((filteredCandidates.length / (candidates.length || 1)) * 100)}% of candidate pool
          </span>
        </div>
      </div>
    </div>
  );
};
