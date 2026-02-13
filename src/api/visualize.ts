import type { StatusAPIResponse } from "../types";

export async function getStatus(): Promise<StatusAPIResponse> {
  const res = await fetch(import.meta.env.VITE_API_URL, {
    method: "GET",
  });

  return res.json();
};
