/*
 * TODO: 
 *  - fix the approval flow
 *    - chairman has the power to automatically approve one or more applicants (you can suggest who else)
 *  
 * 
 * FUTURE FEATURE: 
 *  - add a automatic msg function to automatically sends a msg to that specified to the applicants and committees
 *    - Sample msg: 
 *      - "You have been acccepted to join the '(one Committee)', please msg '(Committee leaders gmail or fb) for futher processing...'
 * 
 */


'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  ExternalLink, 
  Eye, 
  Lock
} from 'lucide-react';
import type { ApplicationsTableProps } from '@/types';
import { 
  getStatusBadgeClass, 
  getCommitteeBadgeClass, 
  getCommitteeTextColorClass, 
  getStatusTextColorClass, 
  exportApplicationsToCsv 
} from '@/lib/utils';
import { STATUS_OPTIONS, ROWS_PER_PAGE_OPTIONS, COMMITTEE_OPTIONS } from '@/data';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty, TablePagination } from '@/components/ui';

export default function ApplicationsTable({ applications, onSelectApplication, onViewDetails, userAssignedCommittee = 'All', officerProfile }: ApplicationsTableProps) {
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
    <div className="bg-cso-card border border-cso rounded-xl p-4 sm:p-6 shadow-xl space-y-4">
      
      {/* Controls Header: Search, Filters & Export */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search student name, ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-cso-input border border-cso text-neutral-900 dark:text-neutral-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-400/50 min-h-[36px]"
          />
        </div>

        {/* Dropdown Filters & CSV Export */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          
          {/* Committee Filter */}
          <div className="relative w-full">
            <select
              value={isCommitteeLocked ? userAssignedCommittee : selectedCommittee}
              disabled={isCommitteeLocked}
              onChange={e => setSelectedCommittee(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-neutral-400/50 min-h-[36px] transition-colors ${
                isCommitteeLocked 
                  ? 'opacity-80 cursor-not-allowed bg-neutral-200 dark:bg-neutral-800 border-cso text-neutral-800 dark:text-neutral-200' 
                  : selectedCommittee !== 'All'
                    ? getCommitteeBadgeClass(selectedCommittee)
                    : 'bg-cso-input border-cso text-neutral-900 dark:text-neutral-100'
              }`}
            >
              {!isCommitteeLocked && <option value="All" className="bg-[#f4f4f2] dark:bg-[#18181b] text-neutral-900 dark:text-neutral-100 font-bold">All Committees</option>}
              {COMMITTEE_OPTIONS.map(({ id, label }) => (
                <option 
                  key={id} 
                  value={id}
                  className={`bg-[#f4f4f2] dark:bg-[#18181b] ${getCommitteeTextColorClass(label)}`}
                >
                  {label}
                </option>
              ))}
            </select>
            {isCommitteeLocked && (
              <Lock className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            )}
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-neutral-400/50 min-h-[36px] transition-colors ${
              selectedStatus !== 'All' 
                ? getStatusBadgeClass(selectedStatus)
                : 'bg-cso-input border-cso text-neutral-900 dark:text-neutral-100'
            }`}
          >
            <option value="All" className="bg-[#f4f4f2] dark:bg-[#18181b] text-neutral-900 dark:text-neutral-100 font-bold">All Statuses</option>
            {STATUS_OPTIONS.filter(s => s !== 'All').map((st) => (
              <option 
                key={st} 
                value={st}
                className={`bg-[#f4f4f2] dark:bg-[#18181b] ${getStatusTextColorClass(st)}`}
              >
                {st}
              </option>
            ))}
          </select>

          {/* Export CSV Button */}
          <button
            onClick={() => exportApplicationsToCsv(filteredApps)}
            disabled={filteredApps.length === 0}
            className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 min-h-[36px]"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

      </div>

      {/* Table Component */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Program & Year</TableHead>
            <TableHead>Primary Choice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedApps.length === 0 ? (
            <TableEmpty
              colSpan={6}
              message={isCommitteeLocked
                ? `No applicant records found for ${userAssignedCommittee}.`
                : 'No applicant records found matching your filters.'}
            />
          ) : (
            paginatedApps.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {app.student_id}
                </TableCell>
                <TableCell className="font-bold text-neutral-900 dark:text-neutral-100">
                  {app.first_name} {app.last_name}
                </TableCell>
                <TableCell>
                  {app.course_program} ({app.year_level})
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${getCommitteeBadgeClass(app.primary_committee)}`}>
                    {app.primary_committee.replace(' Committee', '')}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${getStatusBadgeClass(app.application_status || 'Pending')}`}>
                    {app.application_status || 'Pending'}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <button
                    onClick={() => (onSelectApplication || onViewDetails)?.(app)}
                    className="p-2 sm:p-2.5 rounded-md bg-cso-input text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-[#3f3f46] inline-flex items-center justify-center min-w-[36px] min-h-[36px] border border-cso"
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      <TablePagination
        currentPage={validCurrentPage}
        totalPages={totalPages}
        totalItems={filteredApps.length}
        startIndex={startIndex}
        endIndex={endIndex}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        onPageChange={(page) => setCurrentPage(page)}
        onRowsPerPageChange={(rows) => setRowsPerPage(rows)}
        itemLabel="applicants"
      />
    </div>
  );
}
