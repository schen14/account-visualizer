import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { getServerAuthSession } from "../../../server/auth";
import { env } from "~/env";
import { isAccount, isAccountArray } from "../../../lib/types";
import { fetchJson } from "../../../lib/fetchJson";

export async function GET(_request: NextRequest) {
  const session = await getServerAuthSession();
  
  const urlInput = `${env.API_URL}/accounts`;
  const init = {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user.api_access_token}`
    }
  }
  const errorMessage = 'Failed to fetch data';

  const accounts = await fetchJson<Account[]>(urlInput, init, errorMessage);

  if (Array.isArray(accounts) && isAccountArray(accounts)) {
    return NextResponse.json(accounts);    
  } else {
    throw new Error('Invalid response format');
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerAuthSession();
  // Issue with forwarding form data to backend, so re-construct JSON body data instead
  const formData = await request.formData();
  const bodyData = Object.fromEntries(formData)

  const urlInput = `${env.API_URL}/accounts`;
  const init = {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user.api_access_token}`
    },
    body: JSON.stringify(bodyData),
  }
  const errorMessage = 'Failed to create data';

  const account = await fetchJson<Account>(urlInput, init, errorMessage);

  if (isAccount(account)) {
    return NextResponse.json(account);    
  } else {
    throw new Error('Invalid response format');
  }
}