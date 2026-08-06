'use client';

import React, { useState } from 'react';
import { Layers, Plus, Edit3, Video, Trash2, Power, Play } from 'lucide-react';
import type { Committee, CommitteeManagementTableProps} from '@/types';
import { EditCommitteeModal, CommitteeVideoModal } from '@/components/modals';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '@/components/ui';
import { getCommitteeBadgeClass } from '@/lib/utils';

export default function CommitteeManagementTable({
  committees,
  officerProfile,
  onSaveCommittee,
  onToggleActive,
  onDeleteCommittee,
  onRefresh
}: CommitteeManagementTableProps) {
  const [selectedEditCommittee, setSelectedEditCommittee] = useState<Committee | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedPreviewCommittee, setSelectedPreviewCommittee] = useState<Committee | null>(null);

  const isSuperAdmin = !officerProfile || officerProfile.role === 'super_admin';
  const assignedScope = officerProfile?.assigned_committee || 'All';

  // Filter committees based on RBAC scope
  const visibleCommittees = committees.filter(c => {
    if (isSuperAdmin || assignedScope === 'All') return true;
    return (
      c.name?.toLowerCase() === assignedScope.toLowerCase() || 
      c.shortName?.toLowerCase() === assignedScope.toLowerCase() ||
      c.short_name?.toLowerCase() === assignedScope.toLowerCase()
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Action Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-cso-card border border-cso shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Committee Registry & Video Manager
          </span>
          <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-2 mt-0.5">
            <Layers className="w-5 h-5 text-neutral-500 dark:text-neutral-400" /> Active Committees & Video Showcases
          </h3>
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {isSuperAdmin 
              ? 'Super Admin Controls: Add, edit, upload video showcases, or archive committee divisions.' 
              : `Officer Scope: Manage intro video & details for ${assignedScope}`}
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => {
              setSelectedEditCommittee(null);
              setIsCreatingNew(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add New Committee
          </button>
        )}
      </div>

      {/* Centralized Table Primitive */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Committee & Emblem</TableHead>
            <TableHead>Description & Tags</TableHead>
            <TableHead>Showcase Video Status</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleCommittees.length === 0 ? (
            <TableEmpty colSpan={5} message="No committee records available for your assigned scope." />
          ) : (
            visibleCommittees.map((comm) => {
              const hasVideo = Boolean(comm.videoUrl || comm.video_url);
              const displayTitle = comm.videoTitle || comm.video_title || `${comm.shortName} Video Showcase`;

              return (
                <TableRow key={comm.id}>
                  
                  {/* Logo & Name */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full p-1.5 bg-cso-input border border-cso flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                        <img
                          src={comm.logo || '/imgs/CSOLOGO.png'}
                          alt={comm.name}
                          onError={(e) => {
                            (e.target as HTMLElement).setAttribute('src', '/imgs/CSOLOGO.png');
                          }}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                          {comm.name}
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border mt-0.5 ${getCommitteeBadgeClass(comm.name)}`}>
                          {comm.shortName || comm.short_name}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Description & Tags */}
                  <TableCell className="max-w-xs">
                    <p className="text-neutral-700 dark:text-neutral-300 font-medium line-clamp-2 leading-relaxed">
                      {comm.description || 'No description provided.'}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(comm.tags || []).map((t, idx) => (
                        <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-cso-input text-neutral-600 dark:text-neutral-400 border border-cso">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </TableCell>

                  {/* Video Status */}
                  <TableCell>
                    {hasVideo ? (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          <Video className="w-3 h-3" /> Active Video
                        </span>
                        <button
                          onClick={() => setSelectedPreviewCommittee(comm)}
                          className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 hover:underline flex items-center gap-1 truncate max-w-[160px]"
                          title={displayTitle}
                        >
                          <Play className="w-3 h-3 fill-neutral-700 dark:fill-neutral-300 shrink-0" /> {displayTitle}
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border border-neutral-500/30">
                        Showcase Coming Soon
                      </span>
                    )}
                  </TableCell>

                  {/* Active Status */}
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                      comm.is_active !== false
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-neutral-500/10 text-neutral-500 dark:text-neutral-400 border-neutral-500/30'
                    }`}>
                      {comm.is_active !== false ? 'Active' : 'Archived'}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedEditCommittee(comm)}
                        className="px-3 py-1.5 rounded-lg bg-cso-input border border-cso text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-[#27272a] transition-all inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Details & Video
                      </button>

                      {isSuperAdmin && (
                        <>
                          <button
                            onClick={() => onToggleActive(comm.id, !(comm.is_active !== false))}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              comm.is_active !== false
                                ? 'border-neutral-500/30 text-neutral-500 hover:bg-neutral-500/10'
                                : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'
                            }`}
                            title={comm.is_active !== false ? 'Archive Committee' : 'Activate Committee'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${comm.name}?`)) {
                                onDeleteCommittee(comm.id);
                              }
                            }}
                            className="p-1.5 rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Delete Committee"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </TableCell>

                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Edit / Create Committee Modal */}
      {(selectedEditCommittee || isCreatingNew) && (
        <EditCommitteeModal
          isOpen={Boolean(selectedEditCommittee || isCreatingNew)}
          onClose={() => {
            setSelectedEditCommittee(null);
            setIsCreatingNew(false);
          }}
          committee={selectedEditCommittee}
          onSave={async (committeeData: Partial<Committee>) => {
            const success = await onSaveCommittee(committeeData);
            if (success) {
              onRefresh();
            }
            return success;
          }}
          isSuperAdmin={isSuperAdmin}
        />
      )}

      {/* Video Preview Modal */}
      {selectedPreviewCommittee && (
        <CommitteeVideoModal
          isOpen={Boolean(selectedPreviewCommittee)}
          onClose={() => setSelectedPreviewCommittee(null)}
          committee={selectedPreviewCommittee}
          onApply={() => setSelectedPreviewCommittee(null)}
        />
      )}

    </div>
  );
}
