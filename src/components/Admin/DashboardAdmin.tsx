import { ListDocumentsAdmin } from "./ListDocumentsAdmin";
import { NavbarAdmin } from "./Navbar/NavbarAdmin";

export const DashboardAdmin = () => {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col items-center justify-center py-2">
        <span className="text-xl font-montserrat tracking-widest">
          Tableau de bord d'administration
        </span>
      </div>
      <NavbarAdmin />
      <ListDocumentsAdmin />
    </div>
  );
};
