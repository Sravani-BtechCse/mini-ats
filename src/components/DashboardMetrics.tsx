'use client';

import React from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  TrendingUp, 
  Briefcase, 
  Star,
  Award,
  ChevronRight,
  Filter
} from 'lucide-react';
import { DashboardMetrics as IDashboardMetrics, Stage, Candidate } from '@/types/ats';
import { STAGES } from '@/lib/constants';

interface DashboardMetricsProps {
  metrics: IDashboardMetrics | null;
  candidates: Candidate[];
  onSelectStage: (stage: Stage) => void;
  onSelectCandidate: (candidate: Candidate) => void;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  metrics,
  candidates,
  onSelectStage,
  onSelectCandidate,
}) => {
  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Calculate recent activity from candidate stage histories
  const allActivities: Array<{
    candidate: Candidate;
    stage: Stage;
    changedAt: string;
    changedBy: string;
    note?: string;
  }> = [];

  candidates.forEach((c) => {
    c.stageHistory.forEach((h) => {
      allActivities.push({
        candidate: c,
        stage: h.stage,
        changedAt: h.changedAt,
        changedBy: h.changedBy,
        note: h.note,
      });
    });
  });

  allActivities.sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());
  const recentActivities = allActivities.slice(0, 6);

  const offerAcceptanceRate =
    metrics.offersExtended + metrics.hiredCount > 0
      ? Math.round((metrics.hiredCount / (metrics.offersExtended + metrics.hiredCount)) * 100)
      : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-medium backdrop-blur-sm mb-2">
              <TrendingUp className="w-3.5 h-3.5" /> EarlyJobs.ai Talent Pipeline Live
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Recruitment Analytics & Hiring Metrics
            </h1>
            <p className="text-indigo-200 text-sm mt-1 max-w-xl">
              Track candidate progression across hiring funnels, evaluate role demand, and monitor hiring velocity in real-time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectStage('interview')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm transition flex items-center gap-1.5"
            >
              <span>View Interviews ({candidates.filter((c) => c.stage === 'interview').length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSelectStage('offer')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Offers Extended ({metrics.offersExtended})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Candidates */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Applicants</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-white">
              {metrics.totalCandidates}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18% this cycle
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Active in database across all departments
          </p>
        </div>

        {/* In Pipeline */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active In Pipeline</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-white">
              {metrics.activeInPipeline}
            </span>
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
              {Math.round((metrics.activeInPipeline / metrics.totalCandidates) * 100 || 0)}% of total
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Candidates currently being evaluated
          </p>
        </div>

        {/* Offers & Hires */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Hires & Offers</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-white">
              {metrics.hiredCount + metrics.offersExtended}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {offerAcceptanceRate}% accept rate
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {metrics.hiredCount} onboarding, {metrics.offersExtended} offer extended
          </p>
        </div>

        {/* Time to Hire */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Time To Hire</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-white">
              {metrics.timeToHireDaysEstimate} <span className="text-lg font-semibold">Days</span>
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              ⚡ Top 10%
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            From initial application to offer signed
          </p>
        </div>
      </div>

      {/* Middle Row: Hiring Funnel + Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stage Funnel (Takes 2 columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <span>Hiring Pipeline Stage Funnel</span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Conversion and drop-off distribution across each recruitment milestone
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
              {metrics.totalCandidates} Total Volume
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {metrics.stageFunnel.map((item) => {
              const stageConfig = STAGES.find((s) => s.id === item.stage);
              const maxCount = Math.max(...metrics.stageFunnel.map((s) => s.count), 1);
              const barWidth = Math.max(Math.round((item.count / maxCount) * 100), item.count > 0 ? 8 : 2);

              return (
                <div
                  key={item.stage}
                  onClick={() => onSelectStage(item.stage)}
                  className="group cursor-pointer p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700/40 transition"
                >
                  <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: stageConfig?.color.accent || '#3b82f6' }}
                      />
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {item.label}
                      </span>
                      <span className="text-zinc-400 text-[11px] hidden sm:inline">
                        — {stageConfig?.description}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {item.count}
                      </span>
                      <span className="text-zinc-400 text-[11px]">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-700/60 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: stageConfig?.color.accent || '#6366f1',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roles Distribution */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-500" />
                <span>Applicants by Role</span>
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Distribution of incoming applications per job opening
            </p>

            <div className="space-y-3.5">
              {metrics.roleDistribution.slice(0, 5).map((r) => (
                <div key={r.role}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate pr-2">
                      {r.role}
                    </span>
                    <span className="font-mono text-zinc-600 dark:text-zinc-400 font-semibold">
                      {r.count} ({r.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: `${r.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-700/60">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Avg Candidate Experience</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">
                {metrics.avgExperienceYears} Years
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-2">
              <span>Avg Candidate Score</span>
              <span className="font-bold text-amber-500 flex items-center gap-1 font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {metrics.avgRating} / 5.0
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: Top Skills Cloud + Recent Candidate Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Skills Cloud */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 shadow-sm">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-purple-500" />
            <span>Top Candidate Skills</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
            Most frequent technical skills in active applicant pool
          </p>

          <div className="flex flex-wrap gap-2">
            {metrics.topSkills.map((s) => (
              <span
                key={s.skill}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-700/70 text-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-600/50 flex items-center gap-1.5"
              >
                <span>{s.skill}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-semibold shadow-2xs">
                  {s.count}
                </span>
              </span>
            ))}
          </div>

          <div className="mt-6 p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
            <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
              💡 <strong>Hiring Insight:</strong> React, Spring Boot, and Python are the top 3 dominant skillsets this quarter, closely aligning with EarlyJobs.ai engineering requirements.
            </p>
          </div>
        </div>

        {/* Recent Recruitment Activity Feed (Takes 2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Recent Recruitment Activity
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Audit trail of candidate stage advancements and interview evaluations
              </p>
            </div>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-700/60">
            {recentActivities.map((act, index) => {
              const stageConfig = STAGES.find((s) => s.id === act.stage);
              return (
                <div
                  key={`${act.candidate.id}-${act.stage}-${index}`}
                  onClick={() => onSelectCandidate(act.candidate)}
                  className="py-3 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-700/30 px-2 rounded-xl cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                      {act.candidate.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                          {act.candidate.name}
                        </span>
                        <span className="text-[11px] text-zinc-400 hidden sm:inline">
                          ({act.candidate.role})
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Moved to{' '}
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                          {stageConfig?.label}
                        </span>{' '}
                        by {act.changedBy}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                        stageConfig?.color.badge || 'bg-zinc-100 text-zinc-800'
                      }`}
                    >
                      {stageConfig?.label}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                      {new Date(act.changedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
