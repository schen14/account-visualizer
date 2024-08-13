import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { getServerAuthSession } from "../../../../server/auth";
import { env } from "~/env";
import { isAccountTypes } from "../../../../lib/types";
import { fetchJson } from "../../../../lib/fetchJson";

export async function GET(_request: NextRequest) {
  const session = await getServerAuthSession();

  const urlInput = `${env.API_URL}/accounts/types`;
  const init = {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user.api_access_token}`
    }
  };
  const errorMessage = 'Failed to fetch data';

  const accountTypes = await fetchJson<string[]>(urlInput, init, errorMessage);

  if (isAccountTypes(accountTypes)) {
    return NextResponse.json(accountTypes);
  } else {
    throw new Error('Invalid response format');
  }

  
}
