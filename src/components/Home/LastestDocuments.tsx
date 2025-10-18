import { useQuery } from "@tanstack/react-query";
import { getLastestDocuments } from "../../services/document";
import SpinnerLoader from "../Spinner/Loader";
import type { ErrorResponse } from "../../interfaces/common/common";
import { ItemLastDocument } from "./ItemLastDocument";

export const SectionLastDocuments = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["latest-documents"],
    queryFn: async () => await getLastestDocuments(),
    retry: false,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false, // pas de refetch quand tu reviens sur l’onglet
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-10 h-full">
        <SpinnerLoader size={80} />
        <span className="mt-2 text-lg font-medium tracking-wider font-montserrat">
          Chargement...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center font-montserrat text-red-600 py-10">
        <span className="font-semibold">Erreur :</span>
        <span>
          {(error as unknown as ErrorResponse).description ?? "Erreur interne"}
        </span>
      </div>
    );
  }

  const documents = data ?? [];
  if (documents.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 font-montserrat">
        Aucun document trouvé.
      </div>
    );
  }

  return (
    <div className="w-full relative py-10 h-full flex-1 flex flex-col items-center bg-gradient-to-b from-sky-200 to-green-300">
      {/* Grille responsive */}
      <div className="flex-1 flex flex-col justify-center items-center mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4 px-5 w-full">
          {documents.map((doc) => (
            <ItemLastDocument key={doc.id} doc={doc} />
          ))}
        </div>
      </div>
    </div>
  );
};
