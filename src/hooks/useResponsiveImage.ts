'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to get responsive image URL based on screen size
 * @param desktopUrl - Image URL for desktop (default)
 * @param mobileUrl - Image URL for mobile (optional, defaults to desktopUrl)
 * @returns Image URL appropriate for current screen size
 */
export function useResponsiveImage(desktopUrl: string, mobileUrl?: string): string {
  const [imageUrl, setImageUrl] = useState<string>(desktopUrl);

  useEffect(() => {
    // Handle SSR - default to desktop
    if (typeof window === 'undefined') {
      return;
    }

    const updateImageUrl = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      setImageUrl(isMobile && mobileUrl ? mobileUrl : desktopUrl);
    };

    // Set initial value
    updateImageUrl();

    // Listen for resize events
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleChange = () => updateImageUrl();
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [desktopUrl, mobileUrl]);

  return imageUrl;
}
