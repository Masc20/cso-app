'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, ExternalLink, Eye, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { ApplicationRecord } from '../services/adminApi';

interface ApplicationsTableProps {
  applications: ApplicationRecord[];
  onSelectApplication: (app: ApplicationRecord) => void;
}

export default function ApplicationsTable({ applications, onSelectApplication }: ApplicationsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommittee, setSelectedCommittee] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Filter applications based on search & drop-downs
  const filteredApps = applications.filter(app => {
    const fullName = `${app.first_name} ${app.middle_name || ''} ${app.last_name}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      app.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.course_program.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCommittee = selectedCommittee === 'All' || app.primary_committee === selectedCommittee;
    const matchesStatus = selectedStatus === 'All' || (app.application_status || 'Pending') === selectedStatus;

    return matchesSearch && matchesCommittee && matchesStatus;
  });

  // Export to CSV helper
  const handleExportCsv = () => {
    if (filteredApps.length === 0) return;

    const headers = ['Student ID', 'First Name', 'Middle Name', 'Last Name', 'Facebook Link', 'Program', 'Year Level', 'Primary Committee', 'Secondary Committee', 'Status', 'Date Submitted'];
    const rows = filteredApps.map(a => [
      `"${a.student_id}"`,
      `"${a.first_name}"`,
      `"${a.middle_name || ''}"`,
      `"${a.last_name}"`,
      `"${a.facebook_link}"`,
      `"${a.course_program}"`,
      `"${a.year_level}"`,
      `"${a.primary_committee}"`,
      `"${a.secondary_committee || 'None'}"`,
      `"${a.application_status || 'Pending'}"`,
      `"${new Date(a.created_at).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CSO_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'Approved':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Contacted':
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30';
      case 'Under Review':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Rejected':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      default:
        return 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/30';
    }
  };

  return (
    <div className="bg-[#fafaf8] dark:bg-[#18181b] border border-[#e0e0da] dark:border-[#27272a] rounded-3xl p-6 shadow-xl transition-colors">
      
      {/* Controls Header: Search, Filters & Export */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search student name, ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#121215] border border-neutral-300 dark:border-[#27272a] text-neutral-900 dark:text-neutral-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        {/* Dropdown Filters & CSV Export */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Committee Filter */}
          <select
            value={selectedCommittee}
            onChange={e => setSelectedCommittee(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#121215] border border-neutral-300 dark:border-[#27272a] text-neutral-900 dark:text-neutral-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <option value="All">All Committees</option>
            <option value="G.A.D">G.A.D</option>
            <option value="Gaming Committee">Gaming</option>
            <option value="Networking Committee">Networking</option>
            <option value="Programming Committee">Programming</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#121215] border border-neutral-300 dark:border-[#27272a] text-neutral-900 dark:text-neutral-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Contacted">Contacted</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            disabled={filteredApps.length === 0}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50 ml-auto md:ml-0"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

      </div>

      {/* Applications Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-[#27272a]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f4f4f2] dark:bg-[#121215] border-b border-neutral-200 dark:border-[#27272a] text-neutral-500 dark:text-neutral-400 font-extrabold uppercase tracking-wider">
              <th className="py-3.5 px-4">Student ID</th>
              <th className="py-3.5 px-4">Student Name</th>
              <th className="py-3.5 px-4">Program & Year</th>
              <th className="py-3.5 px-4">Primary Choice</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-[#27272a] font-medium text-neutral-800 dark:text-neutral-200">
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-500 dark:text-neutral-400 font-bold">
                  No applicant records found matching your filters.
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-[#f0f0eb] dark:hover:bg-[#1f1f23] transition-colors">
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
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(app.application_status || 'Pending')}`}>
                      {app.application_status || 'Pending'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {/* View Details */}
                    <button
                      onClick={() => onSelectApplication(app)}
                      className="p-1.5 rounded-lg bg-neutral-200 dark:bg-[#27272a] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-[#3f3f46] transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Open FB Profile */}
                    <a
                      href={app.facebook_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-colors inline-block"
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

    </div>
  );
}
