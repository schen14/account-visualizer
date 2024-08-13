import { env } from "process";
import { getServerAuthSession } from "../server/auth";
import { fetchJson } from "./fetchJson";

export default async function getRecords(accountId: string): Promise<AccRecord[]> {
  const session = await getServerAuthSession();

  return fetchJson<AccRecord[]>(`${env.API_URL}/accounts/${accountId}/records`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user.api_access_token}`
    }
  }, 'Failed to fetch records');
}