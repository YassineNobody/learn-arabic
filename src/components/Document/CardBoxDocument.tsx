import { motion } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import { useState } from "react";
import type { Document as DocumentModel } from "../../interfaces/document/document";
import { FileText, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const CardBoxDocument = ({ doc }: { doc: DocumentModel }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.001 }}
      transition={{ duration: 0.25 }}
      className="group rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow transition-all cursor-pointer"
      onClick={() => navigate(`/category/${doc.category.slug}/${doc.slug}`)}
    >
      {/* PDF Preview */}
      <div className="relative w-full aspect-[3/4] bg-gray-50 flex items-center justify-center">
        {!error ? (
          <Document
            file={doc.urlPdf}
            onLoadSuccess={() => setLoading(false)}
            onLoadError={() => setError(true)}
            loading={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-green-600 w-6 h-6" />
              </div>
            }
          >
            <Page
              pageNumber={1}
              width={240}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <FileText size={40} />
            <span className="text-xs mt-1">Aperçu non disponible</span>
          </div>
        )}

        {/* Overlay loading */}
        {loading && !error && (
          <div className="absolute inset-0 bg-gray-100/70 flex items-center justify-center">
            <Loader2 className="animate-spin text-green-600 w-6 h-6" />
          </div>
        )}
      </div>

      {/* Text content */}
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm sm:text-base font-semibold text-green-700 group-hover:text-green-800 transition line-clamp-1 capitalize tracking-wider font-montserrat text-center">
          {doc.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 tracking-wide font-montserrat text-center italic font-light">
          {doc.description}
        </p>
      </div>
    </motion.div>
  );
};
