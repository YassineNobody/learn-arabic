import { SquarePlus, FilePlus } from "lucide-react";
import  { Link } from "react-router-dom";

export const NavbarAdmin = () => {
  return (
    <div className="py-3 flex flex-row items-center gap-3 justify-center">
      <Link
        to={"/admin/create-category"}
        className="flex flex-row items-center px-2 py-1 bg-sky-700 rounded text-gray-200 font-medium gap-1"
      >
        <SquarePlus size={18} />
        <span className="text-sm tracking-wider">Créer une catégorie</span>
      </Link>
      <Link
        to={"/admin/create-document"}
        className="flex flex-row items-center px-2 py-1 bg-sky-700 rounded text-gray-200 font-medium gap-1"
      >
        <FilePlus size={18} />
        <span className="text-sm tracking-wider">Créer un document</span>
      </Link>
    </div>
  );
};
