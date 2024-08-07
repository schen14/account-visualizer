import { env } from "process";
import { getServerAuthSession } from "../server/auth";
import { NextResponse } from "next/server";

export default async function getAccount(accountId: string) {
  const session = await getServerAuthSession();

  const res = await fetch(`${env.API_URL}/accounts/${accountId}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user.api_access_token}`
    }
  })

  if (!res.ok) throw new Error('faiiled to fetch account')
  
  // const account = await res.json();

  // return NextResponse.json(account);

  return res.json();
}