import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');

  // Generate responsive image sources
  const generateResponsiveSrc = (originalSrc: string, targetWidth?: number) => {
    // For now, we'll use the original images but with optimized loading
    // In a real production app, you'd have multiple sizes generated
    return originalSrc;
  };

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setIsLoaded(true);
      setCurrentSrc(src);
    };
    img.onerror = () => {
      setIsError(true);
      setCurrentSrc('/images/placeholder.jpg'); // Fallback image
    };
    
    // Start loading the image
    img.src = src;
  }, [src]);

  // Placeholder while loading
  const PlaceholderSkeleton = () => (
    <div 
      className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <div className="text-gray-400 text-center">
        <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
        <p className="text-xs">Loading...</p>
      </div>
    </div>
  );

  // Error fallback
  const ErrorFallback = () => (
    <div 
      className={`bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 ${className}`}
      style={{ width, height }}
    >
      <div className="text-gray-500 text-center">
        <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-xs">Image unavailable</p>
      </div>
    </div>
  );

  if (isError) {
    return <ErrorFallback />;
  }

  if (!isLoaded) {
    return <PlaceholderSkeleton />;
  }

  return (
    <motion.img
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      src={currentSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      sizes={sizes}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
      onError={() => setIsError(true)}
    />
  );
}
