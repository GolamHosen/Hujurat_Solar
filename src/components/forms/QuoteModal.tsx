"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import LeadForm from "./LeadForm";
import { useQuoteModal } from "./QuoteModalContext";

export default function QuoteModal() {
  const { isOpen, closeQuoteModal } = useQuoteModal();

  /* Lock body scroll when modal is open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="quote-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={closeQuoteModal}
          />

          {/* Modal Panel */}
          <motion.div
            key="quote-panel"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6"
          >
            <div
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={closeQuoteModal}
                className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close quote form"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header */}
              <div className="border-b border-slate-100 px-6 pt-6 pb-4 sm:px-8 sm:pt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">
                  Free quote
                </p>
                <h2 className="mt-1 font-display text-2xl font-extrabold text-slate-950">
                  Get Your Free Solar Quote
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Fill in your details below and we&rsquo;ll get back to you within one business day.
                </p>
              </div>

              {/* Form */}
              <div className="px-6 py-6 sm:px-8">
                <LeadForm compact />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
