import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "../../../server/auth";
import { env } from "~/env";

export async function GET(request: NextRequest) {
  const session = await getServerAuthSession();

  const res = await fetch(`${env.API_URL}/accounts`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user.api_access_token}`
    }
  })

  if (!res.ok) throw new Error('faiiled to fetch data')
  
  const accounts = await res.json();

  return NextResponse.json(accounts);
}