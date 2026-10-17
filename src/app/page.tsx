'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { DashboardMetrics } from '@/components/DashboardMetrics';
import { KanbanBoard } from '@/components/KanbanBoard';
import { CandidateTable } from '@/components/CandidateTable';
import { CandidateModal } from '@/components/CandidateModal';
import { AddCandidateModal } from '@/components/AddCandidateModal';
import { EmailModal } from '@/components/EmailModal';
import { Candidate, DashboardMetrics as IDashboardMetrics, Stage } from '@/types/ats';
import { STAGES } from '@/lib/constants';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Home() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [metrics, setMetrics] = useState<IDashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'kanban' | 'table'>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [emailCandidate, setEmailCandidate] = useState<Candidate | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  }, []);

  // Fetch candidates from API
  const fetchCandidates = useCallback(async () => {
    try {
      const res = await fetch('/api/candidates');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCandidates(data.data);
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
    }
  }, []);

  // Fetch metrics from API
  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/metrics');
      const data = await res.json();
      if (data.success && data.data) {
        setMetrics(data.data);
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchCandidates(), fetchMetrics()]);
      setLoading(false);
    };
    init();
  }, [fetchCandidates, fetchMetrics]);

  // Stage update handler
  const handleUpdateStage = async (candidateId: string, newStage: Stage) => {
    const stageLabel = STAGES.find((s) => s.id === newStage)?.label || newStage;
    
    // Optimistic UI update
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const updated = {
            ...c,
            stage: newStage,
            stageHistory: [
              ...c.stageHistory,
              {
                stage: newStage,
                changedAt: new Date().toISOString(),
                changedBy: 'Saurav (Hiring Lead)',
                note: `Moved to ${stageLabel}`,
              },
            ],
          };
          if (selectedCandidate?.id === candidateId) {
            setSelectedCandidate(updated);
          }
          return updated;
        }
        return c;
      })
    );

    showToast(`Candidate stage updated to ${stageLabel}`, 'success');

    try {
      await fetch(`/api/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage, author: 'Saurav (Hiring Lead)' }),
      });
      fetchMetrics();
    } catch (err) {
      console.error('Failed to persist stage change:', err);
    }
  };

  // Add note handler
  const handleAddNote = async (
    candidateId: string,
    text: string,
    author: string,
    role: string,
    rating?: number
  ) => {
    try {
      const res = await fetch(`/api/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addNote',
          text,
          author,
          role,
          rating,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCandidates((prev) =>
          prev.map((c) => (c.id === candidateId ? data.data : c))
        );
        setSelectedCandidate(data.data);
        showToast('Evaluation note saved successfully', 'success');
        fetchMetrics();
      }
    } catch (err) {
      console.error('Error adding note:', err);
      showToast('Failed to save evaluation note', 'error');
    }
  };

  // Add Candidate handler
  const handleAddCandidate = async (
    candidateData: Omit<Candidate, 'id' | 'appliedDate' | 'stageHistory' | 'notes'>
  ) => {
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCandidates((prev) => [data.data, ...prev]);
        showToast(`Candidate ${data.data.name} added to pipeline!`, 'success');
        fetchMetrics();
      }
    } catch (err) {
      console.error('Error creating candidate:', err);
      showToast('Failed to create candidate', 'error');
    }
  };

  // Delete Candidate handler
  const handleDeleteCandidate = async (candidateId: string) => {
    const candidateToDelete = candidates.find((c) => c.id === candidateId);
    setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
    if (selectedCandidate?.id === candidateId) {
      setSelectedCandidate(null);
    }
    showToast(`Removed candidate ${candidateToDelete?.name || ''}`, 'info');

    try {
      await fetch(`/api/candidates/${candidateId}`, {
        method: 'DELETE',
      });
      fetchMetrics();
    } catch (err) {
      console.error('Error deleting candidate:', err);
    }
  };

  // Reset Demo data handler
  const handleResetData = async () => {
    if (confirm('Reset all candidates back to default demo dataset?')) {
      try {
        const res = await fetch('/api/reset', { method: 'POST' });
        const data = await res.json();
        if (data.success && data.data) {
          setCandidates(data.data);
          showToast('ATS database reset to default demo candidates', 'success');
          fetchMetrics();
        }
      } catch (err) {
        console.error('Error resetting:', err);
      }
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (candidates.length === 0) {
      showToast('No candidates available to export', 'info');
      return;
    }

    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Role',
      'Department',
      'Stage',
      'Experience (Years)',
      'Skills',
      'Location',
      'Expected Salary',
      'Score Rating',
      'Applied Date',
    ];

    const rows = candidates.map((c) => [
      c.id,
      `"${c.name}"`,
      c.email,
      `"${c.phone}"`,
      `"${c.role}"`,
      c.department,
      c.stage,
      c.experienceYears,
      `"${c.skills.join(', ')}"`,
      `"${c.location}"`,
      `"${c.expectedSalary}"`,
      c.rating,
      c.appliedDate,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EarlyJobs_Candidates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported candidate data to CSV successfully', 'success');
  };

  const handleSelectStageFromDashboard = (stage: Stage) => {
    setCurrentTab('kanban');
    showToast(`Showing stage: ${STAGES.find((s) => s.id === stage)?.label}`, 'info');
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        candidateCount={candidates.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onResetData={handleResetData}
        onExportCsv={handleExportCsv}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-zinc-500 font-medium">Loading ATS metrics & pipeline...</span>
          </div>
        ) : (
          <>
            {/* View 1: Executive Dashboard Metrics */}
            {currentTab === 'dashboard' && (
              <DashboardMetrics
                metrics={metrics}
                candidates={candidates}
                onSelectStage={handleSelectStageFromDashboard}
                onSelectCandidate={(c) => setSelectedCandidate(c)}
              />
            )}

            {/* View 2: Kanban Pipeline Board */}
            {currentTab === 'kanban' && (
              <KanbanBoard
                candidates={candidates}
                onUpdateStage={handleUpdateStage}
                onSelectCandidate={(c) => setSelectedCandidate(c)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {/* View 3: Candidates Data Table */}
            {currentTab === 'table' && (
              <CandidateTable
                candidates={candidates}
                onSelectCandidate={(c) => setSelectedCandidate(c)}
                onUpdateStage={handleUpdateStage}
                onDeleteCandidate={handleDeleteCandidate}
                onOpenEmailModal={(c) => {
                  setEmailCandidate(c);
                  setIsEmailModalOpen(true);
                }}
                onExportCsv={handleExportCsv}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
          </>
        )}

      </main>

      {/* Candidate Profile Modal */}
      <CandidateModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onUpdateStage={handleUpdateStage}
        onAddNote={handleAddNote}
        onDeleteCandidate={handleDeleteCandidate}
        onOpenEmailModal={(c) => {
          setEmailCandidate(c);
          setIsEmailModalOpen(true);
        }}
      />

      {/* Add Candidate Modal */}
      <AddCandidateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCandidate={handleAddCandidate}
      />

      {/* Send Email Modal */}
      <EmailModal
        candidate={emailCandidate}
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setEmailCandidate(null);
        }}
      />

      {/* Toast Notification Pill */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xl border border-zinc-700/50 dark:border-zinc-200 animate-in fade-in slide-in-from-bottom-5 duration-200 text-xs font-semibold">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 dark:text-blue-600 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 dark:text-rose-600 shrink-0" />}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-zinc-400 hover:text-white dark:hover:text-zinc-900"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 bg-white dark:bg-zinc-900 text-xs text-zinc-500 dark:text-zinc-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">EarlyJobs.ai Mini ATS</span>
            <span>•</span>
            <span>Built by Karra Sravani</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://forms.gle/XcpXbf6ZS9WoHBzKA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              EarlyJobs Submission Form
            </a>
            <span>•</span>
            <a
              href="https://github.com/sravanikarra"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-white transition"
            >
              GitHub Portfolio
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
