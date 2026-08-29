'use client';

import { CAMPUS_INFO } from '@/data';
import { ShieldCheck } from 'lucide-react';

export default function AdminFooter() {
    return (
        <footer className="w-full bg-cso-card/50 border-t border-cso py-4 px-4 sm:px-8 transition-colors">
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
                    <span className="inline-flex items-center gap-1 font-bold text-neutral-700 dark:text-neutral-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                        CSO Command Center
                    </span>
                    <span className="hidden sm:inline text-neutral-400 dark:text-neutral-600">&bull;</span>
                        <p>
                            &copy; {new Date().getFullYear()} {CAMPUS_INFO.organizationName}
                        </p>
                </div>

                <div className="flex items-center gap-2 text-center sm:text-right text-[11px]">
                    <p>
                        Developed by <span className="font-semibold text-neutral-700 dark:text-neutral-300">Melecio Andre Cabahug</span> (CSO Internal Vice Chairman 2025–2026)
                    </p>
                </div>
            </div>
        </footer>
    );
}
