import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "../../../../server/auth";
import { env } from "~/env";

export async function POST(request: NextRequest) {
  const session = await getServerAuthSession();

  const res = await fetch(`${env.API_URL}/plaid/link-token`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user.api_access_token}`
    },
    // body: JSON.stringify({ userId: 'unique-user-id' })
  })

  if (!res.ok) throw new Error('faiiled to fetch data')
  
  const data = await res.json();

  return NextResponse.json(data);
}