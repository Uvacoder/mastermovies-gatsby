import { API_PATHS } from "../../services/api/routes";
import { useData } from "./request";

export const useApiSpec = () => useData(API_PATHS.OPEN_API, true);
