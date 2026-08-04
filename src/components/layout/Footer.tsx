'use client';

import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import { COMMITTEES, OFFICIAL_SOCIAL_LINKS, CAMPUS_INFO } from '@/data';

export default function Footer() {
  return (
    <footer className="w-full bg-[#e5e5df] text-neutral-800 border-t border-[#d0d0c8] dark:bg-[#09090b] dark:text-neutral-200 dark:border-cso pt-12 pb-8 mt-16">
      <div className="w-full px-6 sm:px-10 md:px-14">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-neutral-300 dark:border-cso">
          
          {/* Col 1: Organization Info & Facebook Link */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-cso-input flex items-center justify-center p-1 border border-cso shrink-0">
                <img src="/imgs/CSOLOGO.png" alt="CSO Emblem" className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="font-extrabold text-base tracking-wide text-neutral-900 dark:text-neutral-100">
                  CSO - Computer Studies Organization
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{CAMPUS_INFO.institution}</p>
              </div>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-md">
              Empowering students through technology workshops, esports events, network engineering, and software development.
            </p>
            <div className="pt-1">
              <a
                href={OFFICIAL_SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#3b5998]/10 text-[#3b5998] dark:bg-sky-500/10 dark:text-sky-400 border border-[#3b5998]/20 dark:border-sky-500/30 text-xs font-bold hover:opacity-80 min-h-[36px]"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Visit Official Facebook Page
              </a>
            </div>
          </div>

          {/* Col 2: Official Committees with Logo Images */}
          <div>
            <h5 className="font-extrabold text-xs uppercase tracking-widest text-neutral-900 dark:text-neutral-300 mb-3">
              Committees
            </h5>
            <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300 font-semibold">
              {COMMITTEES.map((comm) => (
                <li key={comm.id} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-cso-input p-0.5 border border-cso shrink-0 flex items-center justify-center">
                    <img 
                      src={comm.logo} 
                      alt={`${comm.name} Logo`} 
                      className="w-full h-full object-contain drop-shadow-sm" 
                    />
                  </div>
                  <span>{comm.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Location & Contact */}
          <div>
            <h5 className="font-extrabold text-xs uppercase tracking-widest text-neutral-900 dark:text-neutral-300 mb-3">
              Info & Socials
            </h5>
            <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                {CAMPUS_INFO.institution}, {CAMPUS_INFO.location}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                computerstudiesorganzation.aclc@gmail.com
              </li>
              <li className="flex items-center gap-2 pt-1">
                <svg className="w-4 h-4 text-sky-600 dark:text-sky-400 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <a 
                  href={OFFICIAL_SOCIAL_LINKS.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline font-semibold text-neutral-900 dark:text-neutral-100"
                >
                  {CAMPUS_INFO.institution} - {CAMPUS_INFO.organizationName}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          <p>&copy; {new Date().getFullYear()} {CAMPUS_INFO.organizationName}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Developed by Melecio Andre Cabahug - CSO (2025 - 2026) Internal Vice Chairman
          </p>
        </div>

      </div>
    </footer>
  );
}
