export const sanitizeString = (value: string): string => value
  .replace(/<[^>]*>?/gm, '')
  .replace(/javascript:/gi, '')
  .replace(/on\w+=/gi, '')
  .trim();

export const isValidFacebookUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.com'].includes(url.hostname.toLowerCase())
      && url.protocol === 'https:';
  } catch { return false; }
};

export const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch { return false; }
};
