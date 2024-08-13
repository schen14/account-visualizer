import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { getServerAuthSession } from "../../../../server/auth";
import { env } from "~/env";
import { fetchJson } from "../../../../lib/fetchJson";

interface RequestJsonData {
  publicToken: string;
}

interface ResponseJsonData {
  access_token: string;
}

export async function POST(request: NextRequest) {
  const session = await getServerAuthSession();
  const { publicToken } = await request.json() as RequestJsonData;

  if (!(typeof publicToken === 'string')) {
    throw new Error('Invalid response format');
  }

  const urlInput = `${env.API_URL}/plaid/access-token`;
  const init = {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user.api_access_token}`
    },
    body: JSON.stringify({ public_token: publicToken })
  };
  const errorMessage = 'Failed to fetch data';

  const data = await fetchJson<ResponseJsonData>(urlInput, init, errorMessage);

  return NextResponse.json(data);
}