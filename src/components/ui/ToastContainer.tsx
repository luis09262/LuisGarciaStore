import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Heart, Info, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto bg-[#1A1A1A] text-white p-3.5 rounded-xl shadow-xl border border-[#333] flex items-center gap-3"
          >
            {/* Icon */}
            <div className="w-8 h-8 rounded-lg bg-[#2E2E2E] flex items-center justify-center flex-shrink-0 text-[#E5A88B]">
              {toast.type === 'cart' ? (
                <ShoppingBag className="w-4 h-4 text-[#C85A32]" />
              ) : toast.type === 'wishlist' ? (
                <Heart className="w-4 h-4 text-[#E5A88B]" fill="currentColor" />
              ) : (
                <Info className="w-4 h-4 text-[#EDE8DF]" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-[11px] text-[#A69F94] truncate">
                  {toast.description}
                </p>
              )}
            </div>

            {/* Close */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#777] hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
