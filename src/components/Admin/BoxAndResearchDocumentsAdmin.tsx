import { type FC, useMemo, useState } from "react";
import type { Document } from "../../interfaces/document/document";
import { Search, ChevronDown } from "lucide-react";
import { ItemDocumentAdmin } from "./ItemDocumentAdmin";

export const BoxAndResearchDocumentsAdmin: FC<{ documents: Document[] }> = ({
  documents,
}) => {
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState(false);
  const [sortBy, setSortBy] = useState("recent"); // critère de tri

  // 🔍 Filtrage dynamique selon la recherche
  const filteredDocs = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return documents;
    return documents.filter(
      (doc) =>
        doc.name.toLowerCase().includes(q) ||
        doc.category.name.toLowerCase().includes(q)
    );
  }, [query, documents]);

  // ✨ Suggestions intelligentes
  const suggestions = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    const uniqueNames = Array.from(
      new Set(
        documents
          .filter(
            (doc) =>
              doc.name.toLowerCase().startsWith(lowerQuery) ||
              doc.category.name.toLowerCase().startsWith(lowerQuery)
          )
          .map((doc) => doc.name)
      )
    );
    return uniqueNames.slice(0, 5);
  }, [query, documents]);

  // 🔄 Tri selon le critère choisi
  const sortedDocs = useMemo(() => {
    const docs = [...filteredDocs];
    switch (sortBy) {
      case "name-asc":
        return docs.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return docs.sort((a, b) => b.name.localeCompare(a.name));
      case "category":
        return docs.sort((a, b) =>
          a.category.name.localeCompare(b.category.name)
        );
      case "oldest":
        return docs.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "recent":
      default:
        return docs.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [filteredDocs, sortBy]);

  return (
    <div className="flex flex-col flex-1 w-full max-w-5xl mx-auto">
      {/* Barre de recherche + tri */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 px-3 sm:px-6">
        {/* 🔍 Recherche */}
        <div className="relative flex-1">
          <div className="flex items-center bg-white border border-gray-300 rounded-xl shadow-sm px-3 py-2">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Rechercher un document ou une catégorie..."
              className="flex-1 outline-none bg-transparent text-sm sm:text-base"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocus(true)}
              onBlur={() => setTimeout(() => setFocus(false), 100)}
            />
          </div>

          {/* 💡 Suggestions */}
          {focus && suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg w-full max-h-48 overflow-auto">
              {suggestions.map((name) => (
                <li
                  key={name}
                  onClick={() => setQuery(name)}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm sm:text-base"
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ⚙️ Tri */}
        <div className="relative w-full sm:w-52">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none w-full bg-white border border-gray-300 rounded-xl px-3 py-2 pr-8 shadow-sm text-sm sm:text-base cursor-pointer outline-none"
          >
            <option value="recent">🕒 Plus récents</option>
            <option value="oldest">📜 Plus anciens</option>
            <option value="name-asc">🔤 Nom : A → Z</option>
            <option value="name-desc">🔡 Nom : Z → A</option>
            <option value="category">📂 Par catégorie</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Liste des documents */}
      {sortedDocs.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Aucun document trouvé.
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-3 sm:px-6">
          {sortedDocs.map((doc) => (
            <ItemDocumentAdmin
              doc={doc}
              key={doc.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
};
