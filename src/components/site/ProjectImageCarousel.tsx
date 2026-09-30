"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Camera,
  ZoomIn,
} from "lucide-react";
import type { Image as CmsImage } from "@/data/types";

interface ProjectImageCarouselProps {
  images?: (CmsImage | { url: string; alt?: string | null })[];
  projectTitle: string;
  className?: string;
}

export default function ProjectImageCarousel({
  images = [],
  projectTitle,
  className = "",
}: ProjectImageCarouselProps) {
  // Normalize images and filter out any empty entries
  const validImages = images.filter((img) => img && Boolean(img.url));

  // Fallback to placeholder if none provided
  const slideList =
    validImages.length > 0
      ? validImages
      : [{ url: "/images/project-residential.jpg", alt: projectTitle }];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const total = slideList.length;
  const isMultiple = total > 1;

  const goToSlide = useCallback(
    (index: number, newDirection?: 1 | -1) => {
      if (index === currentIndex) return;
      setDirection(newDirection ?? (index > currentIndex ? 1 : -1));
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  const nextSlide = useCallback(() => {
    if (!isMultiple) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [isMultiple, total]);

  const prevSlide = useCallback(() => {
    if (!isMultiple) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [isMultiple, total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "Escape" && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, isLightboxOpen]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (!thumbnailsRef.current) return;
    const activeThumb = thumbnailsRef.current.children[currentIndex] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentIndex]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStartX(null);
  };

  const currentImage = slideList[currentIndex];
  const currentAlt = currentImage.alt || projectTitle;

  // Slide animation variants
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    }),
  };


  return (
    <div className={`space-y-3.5 select-none ${className}`}>
      {/* MAIN CAROUSEL STAGE */}
      <div
        className="group relative h-80 w-full overflow-hidden rounded-2xl bg-slate-950 sm:h-[28rem] lg:h-[32rem] shadow-xl border border-slate-800/80"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={currentImage.url}
              alt={currentAlt}
              fill
              priority={currentIndex === 0}
              className="object-cover cursor-zoom-in transition-transform duration-700 group-hover:scale-[1.02]"
              sizes="(min-width: 1024px) 65vw, 100vw"
              onClick={() => setIsLightboxOpen(true)}
              unoptimized={currentImage.url.startsWith("/uploads/")}
            />
          </motion.div>
        </AnimatePresence>

        {/* Ambient Top & Bottom Gradients for readable badges */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* TOP CONTROLS BAR */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-auto">
          {/* Slide counter badge */}
          <div className="flex items-center gap-1.5 rounded-full bg-slate-950/70 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white shadow-md border border-white/10">
            <Camera className="h-3.5 w-3.5 text-brand" />
            <span>
              {currentIndex + 1}
              <span className="text-white/50 mx-1">/</span>
              {total}
            </span>
          </div>

          {/* Fullscreen Zoom trigger */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            aria-label="Open fullscreen photo"
            className="flex items-center gap-1.5 rounded-full bg-slate-950/70 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white shadow-md border border-white/10 hover:bg-slate-900 hover:text-brand transition"
          >
            <ZoomIn className="h-3.5 w-3.5 text-brand" />
            <span className="hidden sm:inline">Zoom</span>
          </button>
        </div>

        {/* NAVIGATION CHEVRONS (Only if multiple images) */}
        {isMultiple && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950/60 text-white backdrop-blur-md border border-white/15 shadow-xl transition hover:bg-slate-950 hover:scale-110 active:scale-95 sm:left-4"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950/60 text-white backdrop-blur-md border border-white/15 shadow-xl transition hover:bg-slate-950 hover:scale-110 active:scale-95 sm:right-4"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* BOTTOM DOTS INDICATOR */}
        {isMultiple && (
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-1.5 pointer-events-auto">
            <div className="flex items-center gap-1.5 rounded-full bg-slate-950/60 backdrop-blur-md px-3 py-1.5 border border-white/10">
              {slideList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 transition-all rounded-full ${
                    idx === currentIndex
                      ? "w-6 bg-brand"
                      : "w-1.5 bg-white/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* THUMBNAIL FILMSTRIP STRIP (Only if multiple images) */}
      {isMultiple && (
        <div
          ref={thumbnailsRef}
          className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none pt-0.5"
          style={{ scrollbarWidth: "none" }}
        >
          {slideList.map((img, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={`${img.url}-${idx}`}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`View photo ${idx + 1}`}
                className={`group relative h-16 w-24 shrink-0 sm:h-20 sm:w-28 overflow-hidden rounded-xl border-2 transition-all ${
                  isActive
                    ? "border-brand ring-2 ring-brand/40 scale-[1.03] opacity-100 shadow-md"
                    : "border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${projectTitle} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="112px"
                  unoptimized={img.url.startsWith("/uploads/")}
                />
                {isActive && (
                  <div className="absolute inset-0 bg-brand/10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition active:scale-95 border border-white/20"
              aria-label="Close fullscreen view"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Top Lightbox Info */}
            <div className="absolute top-5 left-5 z-50 flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-white border border-white/15">
                <Camera className="h-3.5 w-3.5 text-brand" />
                <span>
                  {currentIndex + 1} / {total}
                </span>
              </div>
              <p className="hidden md:block text-xs font-medium text-white/70 truncate max-w-md">
                {currentAlt}
              </p>
            </div>

            {/* Lightbox Image Container */}
            <div className="relative h-[78vh] w-full max-w-6xl">
              <Image
                src={currentImage.url}
                alt={currentAlt}
                fill
                priority
                className="object-contain"
                sizes="100vw"
                unoptimized={currentImage.url.startsWith("/uploads/")}
              />
            </div>

            {/* Lightbox Previous / Next Buttons */}
            {isMultiple && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous photo"
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/25 transition active:scale-95 border border-white/20"
                >
                  <ChevronLeft className="h-7 w-7" />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next photo"
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/25 transition active:scale-95 border border-white/20"
                >
                  <ChevronRight className="h-7 w-7" />
                </button>
              </>
            )}

            {/* Bottom Caption */}
            <div className="absolute bottom-5 inset-x-4 text-center">
              <p className="text-xs text-white/60">
                {currentAlt} • Press <kbd className="px-1.5 py-0.5 rounded bg-white/15 text-[10px] text-white">ESC</kbd> or click ✕ to close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
