import { DEFAULT_SERVER_PORT } from "./constants.js";
import type { Db } from "./db.js";
import type { Evalite } from "./types.js";

const BASE_URL = `http://localhost:${DEFAULT_SERVER_PORT}`;

/**
 * Common fetch function with error handling
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns The JSON response
 * @throws Error if the response is not OK
 */
async function safeFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

export const getServerState = async (fetchOpts?: {
  signal?: AbortSignal;
}): Promise<Evalite.ServerState> => {
  return safeFetch<Evalite.ServerState>(
    `${BASE_URL}/api/server-state`,
    fetchOpts
  );
};

export type GetMenuItemsResultEval = {
  filepath: string;
  score: number;
  name: string;
  prevScore: number | undefined;
  evalStatus: Db.EvalStatus;
};

export type GetMenuItemsResult = {
  evals: GetMenuItemsResultEval[];
  score: number;
  prevScore: number | undefined;
  evalStatus: Db.EvalStatus;
};

export const getMenuItems = async (fetchOpts?: {
  signal?: AbortSignal;
}): Promise<GetMenuItemsResult> => {
  return safeFetch<GetMenuItemsResult>(`${BASE_URL}/api/menu-items`, fetchOpts);
};

export type GetEvalByNameResult = {
  history: {
    score: number;
    date: string;
  }[];
  evaluation: Db.Eval & { results: (Db.Result & { scores: Db.Score[] })[] };
  prevEvaluation:
    | (Db.Eval & { results: (Db.Result & { scores: Db.Score[] })[] })
    | undefined;
};

export const getEvalByName = async (
  name: string,
  timestamp: string | null | undefined,
  fetchOpts?: { signal?: AbortSignal }
): Promise<GetEvalByNameResult> => {
  const params = new URLSearchParams({ name, timestamp: timestamp || "" });
  return safeFetch<GetEvalByNameResult>(
    `${BASE_URL}/api/eval?${params.toString()}`,
    fetchOpts
  );
};

export type GetResultResult = {
  result: Db.Result & { traces: Db.Trace[]; score: number; scores: Db.Score[] };
  prevResult: (Db.Result & { score: number; scores: Db.Score[] }) | undefined;
  evaluation: Db.Eval;
};

export const getResult = async (
  opts: {
    evalName: string;
    evalTimestamp: string | null | undefined;
    resultIndex: string;
  },
  fetchOpts?: { signal?: AbortSignal }
): Promise<GetResultResult> => {
  const params = new URLSearchParams({
    name: opts.evalName,
    index: opts.resultIndex,
    timestamp: opts.evalTimestamp || "",
  });
  return safeFetch<GetResultResult>(
    `${BASE_URL}/api/eval/result?${params.toString()}`,
    fetchOpts
  );
};

export const serveFile = (filepath: string) => {
  return `${BASE_URL}/api/file?path=${filepath}`;
};

export const downloadFile = (filepath: string) => {
  return `${BASE_URL}/api/file?path=${filepath}&download=true`;
};
