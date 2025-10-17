import { useParams } from "react-router-dom";
import { useMenu } from "../../hooks/useMenu";
import { ViewerDocument } from "../../components/Document/ViewerDocument";

export const DocumentPage = () => {
  const { slugCategory, slugDocument } = useParams();
  const { menu } = useMenu();

  if (!slugCategory) {
    return (
      <div className="flex-1 p-6 flex flex-col justify-center items-center">
        <p className="text-red-500 text-lg italic font-bold">
          Catégorie invalide.
        </p>
      </div>
    );
  }

  const category = menu.find((p) => p.slug === slugCategory);

  if (!category) {
    return (
      <div className="flex-1 p-6 flex flex-col justify-center items-center">
        <p className="text-red-500 text-lg italic font-bold">
          Catégorie invalide
        </p>
      </div>
    );
  }

  if (!slugDocument) {
    return (
      <div className="flex-1 p-6 flex flex-col justify-center items-center">
        <p className="text-red-500 text-lg italic font-bold">
          Aucun document trouvée.
        </p>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col">
      <ViewerDocument slug={slugDocument} categorySlug={slugCategory} />
    </div>
  );
};
