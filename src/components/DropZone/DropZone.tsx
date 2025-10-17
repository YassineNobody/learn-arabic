import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, XCircle } from "lucide-react";

type DropZoneProps = {
  file?: File | null;
  onFileAccepted: (file: File) => void;
  onFileRemoved: () => void;
};

const DropZone = ({ file, onFileAccepted, onFileRemoved }: DropZoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] }, // ✅ bon MIME type
      noClick: !!file,
    });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl px-6 py-10 text-center cursor-pointer transition-all duration-200 
        shadow-sm flex flex-col justify-center items-center gap-3
        ${
          isDragActive
            ? "bg-green-50 border-green-400 scale-[1.02]"
            : "bg-gray-50 border-gray-300 hover:bg-gray-100"
        }
      `}
    >
      <input {...getInputProps()} />

      {!file ? (
        <>
          {isDragActive ? (
            <UploadCloud className="w-12 h-12 text-green-500 animate-bounce" />
          ) : (
            <FileText className="w-12 h-12 text-gray-400" />
          )}

          <div>
            {isDragActive ? (
              <p className="text-green-600 font-medium text-sm sm:text-base">
                Dépose ton fichier .pdf ici 🚀
              </p>
            ) : (
              <>
                <p className="text-gray-700 font-medium text-sm sm:text-base">
                  Glisse-dépose ton fichier
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  ou clique pour sélectionner un <strong>.pdf</strong>
                </p>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-green-500" />
          <span className="font-medium text-gray-800">{file.name}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFileRemoved();
            }}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
      )}

      {fileRejections.length > 0 && (
        <p className="text-red-600 text-xs sm:text-sm mt-2 font-semibold">
          Seuls les fichiers <strong>.pdf</strong> sont acceptés.
        </p>
      )}
    </div>
  );
};

export default DropZone;
