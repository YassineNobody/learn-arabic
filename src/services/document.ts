import type { PagedResponse } from "../interfaces/common/common";
import type { Document } from "../interfaces/document/document";
import { api, ContentType } from "./api";

export async function createDocument(formData: FormData) {
  return await api.post<FormData, Document>(
    ContentType.DOCUMENT,
    formData,
    undefined,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
}

export async function updateDocument(slug: string, formData: FormData) {
  return await api.update<FormData, Document>(
    ContentType.DOCUMENT,
    slug,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
}

export async function deleteDocument(slug:string){
  return await api.delete<string>(ContentType.DOCUMENT, slug);
}

export async function getDocumentByCategorySlug(
  slug: string,
  page: string,
  size: string
): Promise<PagedResponse<Document>> {
  const resp = await api.get<PagedResponse<Document>>(
    ContentType.DOCUMENT,
    "/category",
    { page, size, slug }
  );
  return resp.data;
}

export async function getDocumentBySlug(slug: string) {
  const resp = await api.get<Document>(ContentType.DOCUMENT, `/${slug}`);
  return resp.data;
}

export async function getAllDocumentsByAdmin() {
  const resp = await api.get<Document[]>(ContentType.DOCUMENT, "/admin/all");
  return resp.data;
}


export async function getLastestDocuments(){
  const resp = await api.get<Document[]>(ContentType.DOCUMENT, "/latest", {limit: "6"});
  return resp.data;
}