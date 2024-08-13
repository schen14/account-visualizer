import { env } from "process";
import { getServerAuthSession } from "../server/auth";
import { fetchJson } from "./fetchJson";

export default async function getAccount(accountId: string): Promise<Account> {
  const session = await getServerAuthSession();

  return fetchJson<Account>(`${env.API_URL}/accounts/${accountId}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user.api_access_token}`
    }
  }, 'Failed to fetch account')
}