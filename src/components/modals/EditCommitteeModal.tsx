'use client';

import React, { useState, useEffect } from 'react';
import { X, Video, Trash2, Upload, Link as LinkIcon, CheckCircle2, Save, Layers, Palette } from 'lucide-react';
import type { Committee, EditCommitteeModalProps } from '@/types';
import { Modal, FloatingInput, FloatingTextarea, FloatingSelect } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { THEME_COLOR_OPTIONS } from '@/config/committeeThemes';

export default function EditCommitteeModal({
  isOpen,
  onClose,
  committee,
  onSave,
  isSuperAdmin
}: EditCommitteeModalProps) {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('/cso-logo.png');
  const [themeColor, setThemeColor] = useState('fuchsia');
  const [tagsInput, setTagsInput] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  const [videoSourceType, setVideoSourceType] = useState<'url' | 'file'>('url');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (committee) {
      setName(committee.name || '');
      setShortName(committee.shortName || committee.short_name || '');
      setDescription(committee.description || '');
      setLogo(committee.logo || '/cso-logo.png');
      setThemeColor(committee.themeColor || committee.theme_color || 'fuchsia');
      setTagsInput(Array.isArray(committee.tags) ? committee.tags.join(', ') : '');
      setVideoUrl(committee.videoUrl || committee.video_url || '');
      setVideoTitle(committee.videoTitle || committee.video_title || '');
      setIsActive(committee.is_active !== false);
      setSaveSuccess(false);
    } else {
      setName('');
      setShortName('');
      setDescription('');
      setLogo('/cso-logo.png');
      setThemeColor('fuchsia');
      setTagsInput('');
      setVideoUrl('');
      setVideoTitle('');
      setIsActive(true);
      setSaveSuccess(false);
    }
  }, [committee, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert('File size exceeds 50MB limit. Please compress the video or use a YouTube link.');
      return;
    }

    setUploadingFile(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${committee?.id || 'comm'}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage
        .from('cso-videos')
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.warn('Storage upload error:', error.message);
        setVideoUrl(fileName);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('cso-videos')
          .getPublicUrl(filePath);
        setVideoUrl(publicUrlData.publicUrl || fileName);
      }
    } catch (err) {
      console.warn('File upload exception:', err);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleRemoveVideo = () => {
    setVideoUrl('');
    setVideoTitle('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const payload: Partial<Committee> = {
      id: committee?.id,
      name,
      shortName: shortName || name.split(' ')[0],
      short_name: shortName || name.split(' ')[0],
      description,
      logo: logo || '/cso-logo.png',
      themeColor,
      theme_color: themeColor,
      tags: parsedTags,
      videoUrl: videoUrl.trim() || undefined,
      video_url: videoUrl.trim() || undefined,
      videoTitle: videoTitle.trim() || undefined,
      video_title: videoTitle.trim() || undefined,
      is_active: isActive
    };

    const success = await onSave(payload);
    setSaving(false);

    if (success) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl sm:max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="h-full flex flex-col min-h-0">
        
        {/* Fixed Header Bar */}
        <div className="shrink-0 flex items-start justify-between border-b border-cso pb-3.5 mb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-bold border bg-neutral-200/60 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 border-cso">
              <Layers className="w-3.5 h-3.5" /> Committee Management
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1.5 leading-tight">
              {committee ? `Manage ${committee.shortName} Committee` : 'Create New Committee Division'}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-mono">
              <span>Scope: {isSuperAdmin ? 'Super Admin (Full Access)' : `${committee?.shortName} Officer`}</span>
              {committee?.id && <span>&bull; ID: {committee.id}</span>}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-cso-input border border-cso text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-[#3f3f46] transition-colors shrink-0 ml-2"
            title="Close Modal (Esc or Click Outside)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs sm:text-sm min-h-0">
          
          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FloatingInput
              label="Committee Name"
              required
              disabled={!isSuperAdmin}
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <FloatingInput
              label="Short Name / Acronym"
              required
              disabled={!isSuperAdmin}
              value={shortName}
              onChange={e => setShortName(e.target.value)}
            />
          </div>

          {/* Description */}
          <FloatingTextarea
            label="Committee Description & Overview"
            required
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          {/* Theme Color, Tags & Logo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FloatingSelect
              label="Brand Theme Color"
              icon={<Palette className="w-4 h-4 text-neutral-500" />}
              options={THEME_COLOR_OPTIONS}
              value={themeColor}
              disabled={!isSuperAdmin}
              onChange={e => setThemeColor(e.target.value)}
            />

            <FloatingInput
              label="Tags (Comma separated)"
              placeholder="e.g. Coding, Hackathons, Web"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
            />

            <FloatingInput
              label="Logo Image Asset URL"
              value={logo}
              disabled={!isSuperAdmin}
              onChange={e => setLogo(e.target.value)}
            />
          </div>

          {/* INTRO VIDEO SHOWCASE MANAGER SECTION */}
          <div className="p-4 rounded-xl bg-[#f4f4f2] dark:bg-[#121215] border border-cso space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 uppercase tracking-wider">
                <Video className="w-4 h-4 text-neutral-500" /> Intro Video Showcase Settings
              </span>

              {videoUrl && (
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="text-[11px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 hover:underline"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Video
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FloatingInput
                label="Custom Video Title (Optional)"
                placeholder="e.g. Gaming Division 2026 Intro"
                value={videoTitle}
                onChange={e => setVideoTitle(e.target.value)}
              />

              {/* Video Source Switch */}
              <div className="flex flex-col justify-center space-y-1">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Video Source Mode
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-cso-input border border-cso">
                  <button
                    type="button"
                    onClick={() => setVideoSourceType('url')}
                    className={`py-1 px-2.5 rounded-md text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                      videoSourceType === 'url'
                        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-sm'
                        : 'bg-cso-card text-neutral-600 dark:text-neutral-400 border-cso hover:bg-neutral-200 dark:hover:bg-[#27272a]'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" /> URL / External Link
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoSourceType('file')}
                    className={`py-1 px-2.5 rounded-md text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                      videoSourceType === 'file'
                        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-sm'
                        : 'bg-cso-card text-neutral-600 dark:text-neutral-400 border-cso hover:bg-neutral-200 dark:hover:bg-[#27272a]'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" /> MP4 File Upload
                  </button>
                </div>
              </div>
            </div>

            {videoSourceType === 'url' ? (
              <FloatingInput
                label="Video URL / Filename / YouTube Embed Link"
                placeholder="e.g. https://www.youtube.com/watch?v=... or intro_video.mp4"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
              />
            ) : (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Upload Compressed Video File (MP4/WebM max 50MB)
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="w-full text-xs font-medium text-neutral-600 dark:text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-neutral-200 dark:file:bg-[#27272a] file:text-neutral-800 dark:file:text-neutral-200 hover:file:bg-neutral-300"
                />
                {uploadingFile && (
                  <p className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 animate-pulse">
                    Uploading video to Supabase Storage...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Super Admin Active Gate Switch */}
          {isSuperAdmin && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f4f4f2] dark:bg-[#121215] border border-cso">
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block">
                  Committee Active Status
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Inactive committees are hidden from the public website & student application portal.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-400"
              />
            </div>
          )}

        </div>

        {/* Modal Action Bar */}
        <div className="shrink-0 flex items-center justify-between pt-3 mt-4 border-t border-cso">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cso-input border border-cso hover:bg-neutral-200 dark:hover:bg-[#27272a] text-neutral-700 dark:text-neutral-300 font-bold text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || uploadingFile}
            className="px-5 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
          >
            {saving ? (
              <span>Saving...</span>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Saved Successfully!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Committee Details
              </>
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
}
