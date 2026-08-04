'use client';

import React, { useEffect, useRef } from 'react';
import { X, Sparkles, ArrowRight, Video } from 'lucide-react';
import type { CommitteeVideoModalProps } from '@/types';
import { Modal } from '@/components/ui';
import { getCommitteeVideoUrl } from '@/lib/utils';

export default function CommitteeVideoModal({
  isOpen,
  onClose,
  committee,
  onApply
}: CommitteeVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-pause video when modal closes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen, onClose]);

  if (!committee) return null;

  const rawVideoSrc = getCommitteeVideoUrl(committee.videoUrl);

  const isYouTubeUrl = (url?: string) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('embed')) return url;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : url;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl p-0 overflow-hidden"
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-cso bg-[#f4f4f2]/50 dark:bg-[#18181b]/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full p-1.5 bg-cso-input border border-cso flex items-center justify-center shrink-0">
            <img src={committee.logo} alt={committee.name} className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              {committee.videoTitle || `${committee.shortName} Introductory Video`}
            </h3>
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Official Committee Showcase & Overview
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-[#27272a] transition-colors"
          aria-label="Close video player"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Body: Video Player Frame */}
      <div className="p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[75vh]">
        {rawVideoSrc ? (
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-neutral-800 flex items-center justify-center">
            {isYouTubeUrl(rawVideoSrc) ? (
              <iframe
                src={getYouTubeEmbedUrl(rawVideoSrc)}
                title={`${committee.name} Introductory Video`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                ref={videoRef}
                src={rawVideoSrc}
                poster={committee.videoPoster}
                controls
                autoPlay
                preload="metadata"
                playsInline
                className="w-full h-full object-contain"
              >
                Your browser does not support HTML5 video playback.
              </video>
            )}
          </div>
        ) : (
          <div className="w-full aspect-video bg-[#18181b] border-2 border-dashed border-neutral-700 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/30 animate-bounce">
              <Video className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-neutral-100">
              Video Showcase Coming Soon!
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed font-medium">
              The {committee.name} officers are currently editing the official intro video. In the meantime, you can apply directly below!
            </p>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
            {committee.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {committee.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-cso-input text-neutral-800 dark:text-neutral-300 border border-cso"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Footer CTA */}
      <div className="p-4 sm:px-6 border-t border-cso bg-[#f4f4f2]/50 dark:bg-[#18181b]/50 flex items-center justify-between gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-lg border border-cso text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-[#27272a] transition-colors"
        >
          Close Video
        </button>

        <button
          onClick={() => {
            onClose();
            onApply(committee.id);
          }}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-transform active:scale-95"
        >
          <Sparkles className="w-4 h-4" /> Apply for {committee.shortName} <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </Modal>
  );
}
