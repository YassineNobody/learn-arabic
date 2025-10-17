import type {
  Progression,
  UpdateProgression,
} from "../interfaces/progression/progression";
import { api, ContentType } from "./api";

export async function getProgression() {
  const resp = await api.get<Progression>(ContentType.PROGRESSIONS, "/me");
  return resp.data;
}

export async function updateProgression(update: UpdateProgression) {
  const resp = await api.updateProgression<Progression>(
    ContentType.PROGRESSIONS,
    { ...update }
  );
  return resp.data;
}

export async function deleteProgression(deleteProgression: UpdateProgression) {
  const resp = await api.deleteProgression<Progression>(
    ContentType.PROGRESSIONS,
    {
      ...deleteProgression,
    }
  );
  return resp.data;
}
