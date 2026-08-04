'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  ExternalLink, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Lock
} from 'lucide-react';
import type { ApplicationsTableProps } from '../types';
import { getStatusBadgeClass, exportApplicationsToCsv } from '@/lib/utils';
import { STATUS_FILTER_OPTIONS, ROWS_PER_PAGE_OPTIONS, COMMITTEE_OPTIONS } from '@/data';

export default function ApplicationsTable({ applications, onSelectApplication, userAssignedCommittee = 'All' }: ApplicationsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommittee, setSelectedCommittee] = useState(userAssignedCommittee || 'All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const isCommitteeLocked = Boolean(userAssignedCommittee && userAssignedCommittee !== 'All');

  // Hard sync locked committee when userAssignedCommittee changes
  useEffect(() => {
    if (isCommitteeLocked && userAssignedCommittee) {
      setSelectedCommittee(userAssignedCommittee);
    }
  }, [userAssignedCommittee, isCommitteeLocked]);

  // Filter applications based on search & drop-downs (Hard Scope Filter + G.A.D alias support)
  const filteredApps = applications.filter(app => {
    const fullName = `${app.first_name} ${app.middle_name || ''} ${app.last_name}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      app.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.course_program.toLowerCase().includes(searchTerm.toLowerCase());

    const activeCommitteeScope = isCommitteeLocked ? userAssignedCommittee : selectedCommittee;
    
    // G.A.D alias matching support (G.A.D vs G.A.D Committee)
    const matchesCommittee = 
      activeCommitteeScope === 'All' || 
      app.primary_committee === activeCommitteeScope ||
      (activeCommitteeScope.includes('G.A.D') && app.primary_committee.includes('G.A.D'));

    const matchesStatus = selectedStatus === 'All' || (app.application_status || 'Pending') === selectedStatus;

    return matchesSearch && matchesCommittee && matchesStatus;
  });

  // Reset to page 1 whenever filters or rowsPerPage change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCommittee, selectedStatus, rowsPerPage]);

  // Calculate Pagination Slices
  const totalPages = Math.max(1, Math.ceil(filteredApps.length / rowsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredApps.length);
  const paginatedApps = filteredApps.slice(startIndex, endIndex);

  return (
    <div className="bg-cso-card border border-cso rounded-xl p-4 sm:p-6 shadow-xl">
      
      {/* Controls Header: Search, Filters & Export */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
        
        {/* Search Bar */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search student name, ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-cso-input border border-cso text-neutral-900 dark:text-neutral-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[36px]"
          />
        </div>

        {/* Dropdown Filters & CSV Export */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          
          {/* Committee Filter (Hard Locked if scoped to specific committee) */}
          <div className="relative w-full">
            <select
              value={isCommitteeLocked ? userAssignedCommittee : selectedCommittee}
              disabled={isCommitteeLocked}
              onChange={e => setSelectedCommittee(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-lg bg-cso-input border border-cso text-neutral-900 dark:text-neutral-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[36px] ${
                isCommitteeLocked ? 'opacity-80 cursor-not-allowed bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' : ''
              }`}
            >
              {!isCommitteeLocked && <option value="All">All Committees</option>}
              {COMMITTEE_OPTIONS.map(({ id, label }) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
            {isCommitteeLocked && (
              <Lock className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" />
            )}
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-cso-input border border-cso text-neutral-900 dark:text-neutral-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[36px]"
          >
            <option value="All">All Statuses</option>
            {STATUS_FILTER_OPTIONS.filter(s => s !== 'All').map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {/* Export CSV Button */}
          <button
            onClick={() => exportApplicationsToCsv(filteredApps)}
            disabled={filteredApps.length === 0}
            className="w-full px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 min-h-[36px]"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

      </div>

      {/* Touch-Scroll Hint Banner for Mobile Screen Users */}
      <div className="block sm:hidden text-[10px] text-neutral-500 dark:text-neutral-400 font-bold mb-2 flex items-center gap-1">
        <span>↔ Swipe table horizontally to view full details & actions</span>
      </div>

      {/* Applications Data Table Container */}
      <div className="overflow-x-auto overflow-y-auto max-h-[65vh] rounded-lg border border-cso -mx-1 sm:mx-0 relative">
        <table className="w-full min-w-[650px] text-left border-collapse text-xs">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="bg-[#f4f4f2] dark:bg-[#121215] border-b border-cso text-neutral-500 dark:text-neutral-400 font-extrabold uppercase tracking-wider">
              <th className="sticky top-0 z-20 bg-[#f4f4f2] dark:bg-[#121215] py-3.5 px-4 border-b border-cso">Student ID</th>
              <th className="sticky top-0 z-20 bg-[#f4f4f2] dark:bg-[#121215] py-3.5 px-4 border-b border-cso">Student Name</th>
              <th className="sticky top-0 z-20 bg-[#f4f4f2] dark:bg-[#121215] py-3.5 px-4 border-b border-cso">Program & Year</th>
              <th className="sticky top-0 z-20 bg-[#f4f4f2] dark:bg-[#121215] py-3.5 px-4 border-b border-cso">Primary Choice</th>
              <th className="sticky top-0 z-20 bg-[#f4f4f2] dark:bg-[#121215] py-3.5 px-4 border-b border-cso">Status</th>
              <th className="sticky top-0 z-20 bg-[#f4f4f2] dark:bg-[#121215] py-3.5 px-4 text-right border-b border-cso">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-[#27272a] font-medium text-neutral-800 dark:text-neutral-200">
            {paginatedApps.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-500 dark:text-neutral-400 font-bold">
                  {isCommitteeLocked
                    ? `No applicant records found for ${userAssignedCommittee}.`
                    : 'No applicant records found matching your filters.'}
                </td>
              </tr>
            ) : (
              paginatedApps.map((app) => (
                <tr key={app.id} className="hover:bg-[#f0f0eb] dark:hover:bg-[#1f1f23]">
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {app.student_id}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-neutral-100">
                    {app.first_name} {app.last_name}
                  </td>
                  <td className="py-3.5 px-4">
                    {app.course_program} ({app.year_level})
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-amber-600 dark:text-amber-400">
                    {app.primary_committee.replace(' Committee', '')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${getStatusBadgeClass(app.application_status || 'Pending')}`}>
                      {app.application_status || 'Pending'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => onSelectApplication(app)}
                      className="p-2 sm:p-2.5 rounded-md bg-neutral-200 dark:bg-[#27272a] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-[#3f3f46] inline-flex items-center justify-center min-w-[36px] min-h-[36px]"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <a
                      href={app.facebook_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 sm:p-2.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 inline-flex items-center justify-center min-w-[36px] min-h-[36px]"
                      title="Open Facebook Profile"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredApps.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-4 border-t border-cso text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          
          <div className="text-center sm:text-left">
            Showing <span className="font-extrabold text-neutral-900 dark:text-neutral-100">{filteredApps.length === 0 ? 0 : startIndex + 1}</span> to{' '}
            <span className="font-extrabold text-neutral-900 dark:text-neutral-100">{endIndex}</span> of{' '}
            <span className="font-extrabold text-neutral-900 dark:text-neutral-100">{filteredApps.length}</span> applicants
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={rowsPerPage}
                onChange={e => setRowsPerPage(Number(e.target.value))}
                className="px-2.5 py-1.5 rounded-md bg-cso-input border border-cso text-neutral-900 dark:text-neutral-100 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                {ROWS_PER_PAGE_OPTIONS.map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <span>per page</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={validCurrentPage === 1}
                className="p-2 sm:p-2.5 rounded-md bg-cso-input border border-cso disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-[#27272a] inline-flex items-center justify-center min-w-[36px] min-h-[36px]"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={validCurrentPage === 1}
                className="p-2 sm:p-2.5 rounded-md bg-cso-input border border-cso disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-[#27272a] inline-flex items-center justify-center min-w-[36px] min-h-[36px]"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2.5 py-1 font-bold text-neutral-900 dark:text-neutral-100 text-center min-w-[80px]">
                Page {validCurrentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={validCurrentPage === totalPages}
                className="p-2 sm:p-2.5 rounded-md bg-cso-input border border-cso disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-[#27272a] inline-flex items-center justify-center min-w-[36px] min-h-[36px]"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={validCurrentPage === totalPages}
                className="p-2 sm:p-2.5 rounded-md bg-cso-input border border-cso disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-[#27272a] inline-flex items-center justify-center min-w-[36px] min-h-[36px]"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
