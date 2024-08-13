import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { getServerAuthSession } from "../../../../server/auth";
import { env } from "~/env";
import { fetchJson } from "../../../../lib/fetchJson";

interface ResponseJsonData {
  link_token: string;
}

export async function POST(_request: NextRequest) {
  const session = await getServerAuthSession();

  const urlInput = `${env.API_URL}/plaid/link-token`;
  const init = {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user.api_access_token}`
    },
    // body: JSON.stringify({ userId: 'unique-user-id' })
  };
  const errorMessage = 'Failed to fetch data';

  const data = await fetchJson<ResponseJsonData>(urlInput, init, errorMessage);

  return NextResponse.json(data);
}