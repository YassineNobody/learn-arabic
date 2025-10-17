/**
 * Met à jour l'URL sans recharger la page,
 * pour pointer vers un document dans une catégorie donnée.
 *
 * @param categorySlug Slug de la catégorie (ex: "vocabulaire")
 * @param documentSlug Slug du document (ex: "les-couleurs")
 */
export function navigateToDocument(categorySlug: string, documentSlug: string) {
  if (!categorySlug || !documentSlug) return;
  const newUrl = `/category/${categorySlug}/${documentSlug}`;
  window.history.pushState({}, "", newUrl);
}
