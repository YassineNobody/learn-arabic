import { Earth } from "lucide-react";
import { BoxCategories } from "../Category/BoxCategories";

export const BrowserHome = () => {
  return (
    <div className="w-full relative h-full flex flex-col items-center bg-gradient-to-b from-teal-100 to-violet-100">
      <div className=" w-full flex-1 flex flex-col justify-center">
        <h2 className="flex flex-row items-center justify-center gap-2 text-3xl font-bold font-montserrat text-sky-900 text-shadow-lg mb-10 mt-20">
          <Earth size={30} />
          <span className="tracking-wider italic text-shadow-lg">Explorer</span>
        </h2>
        <BoxCategories />
      </div>
    </div>
  );
};
