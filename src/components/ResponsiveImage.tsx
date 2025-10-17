import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  aspectRatio?: string;
  placeholder?: 'blur' | 'skeleton' | 'none';
}

export function ResponsiveImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  objectFit = 'cover',
  aspectRatio,
  placeholder = 'skeleton'
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Handle image loading
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.onload = () => {
      setIsLoaded(true);
    };
    img.onerror = () => {
      setIsError(true);
    };
    img.src = src;
  }, [src, isInView]);

  // Get responsive image styles
  const getImageStyles = () => {
    const baseStyles: React.CSSProperties = {
      width: '100%',
      height: '100%',
      objectFit,
      transition: 'opacity 0.3s ease-in-out',
    };

    if (aspectRatio) {
      baseStyles.aspectRatio = aspectRatio;
    }

    return baseStyles;
  };

  // Skeleton placeholder
  const SkeletonPlaceholder = () => (
    <div className="animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]">
      <div className="w-full h-full flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );

  // Error fallback
  const ErrorFallback = () => (
    <div className="bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
      <div className="text-gray-500 text-center p-4">
        <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-xs">Image unavailable</p>
      </div>
    </div>
  );

  const containerStyles: React.CSSProperties = {
    width: width || '100%',
    height: height || 'auto',
    aspectRatio: aspectRatio || undefined,
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      style={containerStyles}
    >
      {/* Show placeholder while loading */}
      {!isLoaded && !isError && placeholder === 'skeleton' && (
        <div className="absolute inset-0">
          <SkeletonPlaceholder />
        </div>
      )}

      {/* Show error fallback */}
      {isError && (
        <div className="absolute inset-0">
          <ErrorFallback />
        </div>
      )}

      {/* Show actual image when loaded */}
      {isLoaded && !isError && (
        <motion.img
          ref={imgRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={src}
          alt={alt}
          style={getImageStyles()}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setIsError(true)}
        />
      )}
    </div>
  );
}

// Add shimmer animation to global CSS
const shimmerCSS = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

// Inject CSS if not already present
if (typeof document !== 'undefined' && !document.getElementById('shimmer-styles')) {
  const style = document.createElement('style');
  style.id = 'shimmer-styles';
  style.textContent = shimmerCSS;
  document.head.appendChild(style);
}
