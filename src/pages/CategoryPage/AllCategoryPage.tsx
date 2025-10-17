import { Compass } from "lucide-react";
import { BoxCategories } from "../../components/Category/BoxCategories";

export const AllCategoryPage = () => {
  return (
    <div className="flex-1 flex flex-col py-3">
      <div className="flex flex-col py-2 items-center justify-center">
        <div className="flex flex-row gap-2 items-center py-3 text-shadow-lg">
          <Compass size={26} className="text-blue-800" />
          <span className="text-2xl font-montserrat tracking-wider text-blue-800 font-medium underline underline-offset-4">Explorer les catégories</span>
        </div>
      </div>
      <div className="flex flex-col mt-5">
        <BoxCategories />
      </div>
    </div>
  );
};
