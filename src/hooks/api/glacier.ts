import { API_PATHS } from "../../services/api/routes";
import { IGlacier, IGlacierSummary } from "../../types/glacier";
import { useData } from "./request";

export const useGlacierFilm = (id?: number) => useData<IGlacier>(id && API_PATHS.GLACIER.FILM(id));

export const useGlacierFilms = (...params: Parameters<typeof API_PATHS.GLACIER.LIST>) =>
  useData<IGlacierSummary[]>(API_PATHS.GLACIER.LIST(...params));
