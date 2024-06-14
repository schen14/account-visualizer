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

export async function POST(request: NextRequest) {
  const session = await getServerAuthSession();
  // Issue with forwarding form data to backend, so re-construct JSON body data instead
  const formData = await request.formData();
  const bodyData = Object.fromEntries(formData)

  const res = await fetch(`${env.API_URL}/accounts`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user.api_access_token}`
    },
    body: JSON.stringify(bodyData),
  })

  if (!res.ok) throw new Error('failed to create data')

  const account = await res.json();

  return NextResponse.json(account);
}