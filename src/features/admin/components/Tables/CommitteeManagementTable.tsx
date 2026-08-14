/**
 *  TODO: 
 *    - fix this spaghetti logic
 *      - first centralized the color into one column called (theme)
 *      - add a option to change the icons of each new and old ribbons
 */

'use client';

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Video, Play, Power, Lock } from 'lucide-react';
import type { CommitteeManagementTableProps, Committee } from '@/types';
import { getCommitteeBadgeClass } from '@/lib/utils';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '@/components/ui';
import { EditCommitteeModal, CommitteeVideoModal, ConfirmModal } from '@/components/modals';

export default function CommitteeManagementTable({
  committees,
  officerProfile,
  onSaveCommittee,
  onToggleActive,
  onDeleteCommittee,
  onRefresh
}: CommitteeManagementTableProps) {
  const [selectedEditCommittee, setSelectedEditCommittee] = useState<Committee | null>(null);
  const [selectedPreviewCommittee, setSelectedPreviewCommittee] = useState<Committee | null>(null);
  const [deletingCommittee, setDeletingCommittee] = useState<Committee | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const isSuperAdmin = officerProfile?.role === 'super_admin';
  const officerAssignedScope = officerProfile?.assigned_committee || 'All';

  // Check if current officer can edit this committee
  const canEditCommittee = (comm: Committee) => {
    if (isSuperAdmin) return true;
    if (!officerAssignedScope || officerAssignedScope === 'All') return true;

    const commName = (comm.name || '').toLowerCase();
    const commShort = (comm.shortName || comm.short_name || '').toLowerCase();
    const commId = (comm.id || '').toLowerCase();
    const scope = officerAssignedScope.toLowerCase();

    return (
      commName === scope ||
      commShort === scope ||
      commId === scope ||
      (scope.includes('g.a.d') && commName.includes('g.a.d'))
    );
  };

  return (
    <div className="bg-cso-card border border-cso rounded-xl p-4 sm:p-6 shadow-xl space-y-4">
      
      {/* Table Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-cso">
        <div>
          <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            CSO Committee Wings & Video Showcases
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            Manage committee information, descriptions, tag skillsets, and introduction showcase videos.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => {
              setSelectedEditCommittee(null);
              setIsCreatingNew(true);
            }}
            className="px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Committee
          </button>
        )}
      </div>

      {/* Centralized Table Component */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Committee Identity</TableHead>
            <TableHead>Description & Skillsets</TableHead>
            <TableHead>Video Showcase</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {committees.length === 0 ? (
            <TableEmpty colSpan={5} message="No committee records found." />
          ) : (
            committees.map((comm) => {
              const videoSrc = comm.videoUrl || comm.video_url;
              const videoTitle = comm.videoTitle || comm.video_title;
              const hasVideo = Boolean(videoSrc && videoSrc.trim());
              const displayTitle = videoTitle || (videoSrc ? videoSrc.split('/').pop() : 'Intro Video');
              const isEditable = canEditCommittee(comm);

              return (
                <TableRow key={comm.id}>
                  
                  {/* Committee Logo & Name */}
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

                  {/* Actions (Scoped to Officer Assigned Committee) */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isEditable ? (
                        <button
                          onClick={() => setSelectedEditCommittee(comm)}
                          className="px-3 py-1.5 rounded-lg bg-cso-input border border-cso text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-[#27272a] transition-all inline-flex items-center gap-1.5 shadow-sm"
                          title="Edit Committee Details & Showcase Video"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit Details & Video
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-1.5 rounded-lg bg-neutral-200/50 dark:bg-neutral-800/40 border border-cso text-xs font-bold text-neutral-400 dark:text-neutral-500 cursor-not-allowed opacity-60 inline-flex items-center gap-1.5 shadow-sm"
                          title={`Scope Locked: You can only edit your assigned committee (${officerAssignedScope})`}
                        >
                          <Lock className="w-3.5 h-3.5" /> Scope Locked
                        </button>
                      )}

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
                            onClick={() => setDeletingCommittee(comm)}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingCommittee)}
        onClose={() => setDeletingCommittee(null)}
        onConfirm={() => {
          if (deletingCommittee) {
            onDeleteCommittee(deletingCommittee.id);
            setDeletingCommittee(null);
          }
        }}
        title="Delete Committee Division?"
        message={
          <>
            Are you sure you want to permanently delete <strong className="text-neutral-900 dark:text-neutral-100">{deletingCommittee?.name}</strong>? This action cannot be undone.
          </>
        }
        confirmText="Delete Record"
        cancelText="Cancel"
        variant="danger"
      />

    </div>
  );
}
