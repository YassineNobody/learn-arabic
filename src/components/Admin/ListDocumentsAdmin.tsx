import { useQuery } from "@tanstack/react-query";
import { getAllDocumentsByAdmin } from "../../services/document";
import { motion } from "framer-motion";
import type { ErrorResponse } from "../../interfaces/common/common";
import { BoxAndResearchDocumentsAdmin } from "./BoxAndResearchDocumentsAdmin";

export const ListDocumentsAdmin = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-list-documents"],
    queryFn: async () => await getAllDocumentsByAdmin(),
    retry: false,
  });
  if (isLoading)
    return (
      <motion.div
        className="flex flex-col gap-3 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="h-16 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </motion.div>
    );

  if (isError)
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-600 text-center mt-10"
      >
        {(error as unknown as ErrorResponse).description ??
          "Une erreur est survenue."}
      </motion.p>
    );

  return <div
    className="flex-1 flex flex-col"
  >{data && <BoxAndResearchDocumentsAdmin documents={data} />}</div>;
};
