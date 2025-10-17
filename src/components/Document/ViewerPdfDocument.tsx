import { useEffect, useRef, useState, type FC } from "react";
import { Document as PdfDocument, Page, pdfjs } from "react-pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import { motion } from "framer-motion";
import { Loader2, FileWarning } from "lucide-react"; // ⚠️ pour les erreurs
import type { Document } from "../../interfaces/document/document";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const ViewerPdfDocument: FC<{ data: Document }> = ({ data }) => {
  const { urlPdf } = data;

  const [numPages, setNumPages] = useState<number | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(true);
  const [pdfWidth, setPdfWidth] = useState(800);
  const [loadError, setLoadError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 📱 Gestion responsive fluide
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setPdfWidth(Math.min(width, 800)); // limite max pour éviter la surcharge CPU
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-md rounded-xl p-3 w-full max-w-5xl mx-auto overflow-hidden"
      >
        <PdfDocument
          file={urlPdf}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setIsPdfLoading(false);
            setLoadError(null);
          }}
          onLoadError={(error) => {
            console.error("Erreur PDF:", error);
            setLoadError("Impossible de charger le PDF.");
            setIsPdfLoading(false);
          }}
          loading={
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-green-600 w-8 h-8" />
            </div>
          }
        >
          {/* Loader en overlay */}
          {isPdfLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-green-600 w-8 h-8" />
            </div>
          )}

          {/* Gestion d'erreur */}
          {loadError && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <FileWarning className="w-10 h-10 text-red-500 mb-2" />
              <p className="text-sm font-semibold">{loadError}</p>
            </div>
          )}

          {/* Rendu des pages du PDF */}
          {!isPdfLoading && !loadError && numPages && (
            <div className="flex flex-col gap-4 items-center">
              {Array.from({ length: numPages }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex justify-center"
                >
                  <Page
                    pageNumber={i + 1}
                    width={pdfWidth - 20}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </PdfDocument>
      </motion.div>
    </div>
  );
};
