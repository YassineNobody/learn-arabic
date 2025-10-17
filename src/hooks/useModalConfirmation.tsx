import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

/**
 * Hook pour afficher une modale de confirmation stylisée et animée.
 */
export const useModalConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<{
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    icon?: "success" | "error" | "info";
    resolve?: (value: boolean) => void;
  }>({
    title: "",
    message: "",
    confirmText: "Confirmer",
    cancelText: "Annuler",
    icon: "info",
  });

  const confirm = (opts: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    icon?: "success" | "error" | "info";
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions({ ...opts, resolve });
      setIsOpen(true);
    });
  };

  const handleConfirm = () => {
    options.resolve?.(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    options.resolve?.(false);
    setIsOpen(false);
  };

  const ConfirmDialog = () => {
    return (
      <AnimatePresence>
        {isOpen && (
          <Dialog
            as="div"
            open={isOpen}
            onClose={handleCancel}
            className="relative z-50"
          >
            {/* === Backdrop === */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* === Container === */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-200"
              >
                {/* === Header avec icône === */}
                <div className="flex flex-col items-center text-center p-5">
                  <div className="mb-3">
                    {options.icon === "success" && (
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    )}
                    {options.icon === "error" && (
                      <XCircle className="w-12 h-12 text-red-600" />
                    )}
                    {options.icon === "info" && (
                      <AlertCircle className="w-12 h-12 text-blue-500" />
                    )}
                  </div>

                  {options.title && (
                    <h2 className="text-lg font-bold text-gray-800 font-montserrat mb-1">
                      {options.title}
                    </h2>
                  )}

                  <p className="text-gray-600 text-sm font-light px-3">
                    {options.message}
                  </p>
                </div>

                {/* === Boutons === */}
                <div className="flex items-center justify-center gap-3 border-t border-gray-100 p-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-100 transition"
                  >
                    {options.cancelText ?? "Annuler"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirm}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition"
                  >
                    {options.confirmText ?? "Confirmer"}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    );
  };

  return { confirm, ConfirmDialog };
};
