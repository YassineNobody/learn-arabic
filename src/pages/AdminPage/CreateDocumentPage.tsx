import { CreateDocumentForm } from "../../components/Admin/Form/CreateDocumentForm";

export const CreateDocumentPage = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="sm:max-w-lg w-full">
        <CreateDocumentForm />
      </div>
    </div>
  );
};
