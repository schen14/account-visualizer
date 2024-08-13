import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { getServerAuthSession } from "../../../../server/auth";
import { env } from "~/env";
import { isAccount } from "../../../../lib/types";
import { fetchJson } from "../../../../lib/fetchJson";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } } ) {
  const session = await getServerAuthSession();
  // Issue with forwarding form data to backend, so re-construct JSON body data instead
  const formData = await request.formData();
  const bodyData = Object.fromEntries(formData)

  const urlInput = `${env.API_URL}/accounts/${params.id}`;
  const init = {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user.api_access_token}`
    },
    body: JSON.stringify(bodyData),
  };
  const errorMessage = 'Failed to update data';

  const account = await fetchJson<Account>(urlInput, init, errorMessage);

  if (isAccount(account)) {
    return NextResponse.json(account);
  } else {
    throw new Error('Invalid response format');
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } } ) {
  const session = await getServerAuthSession();

  const res = await fetch(`${env.API_URL}/accounts/${params.id}`, {
    method: "DELETE",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user.api_access_token}`
    },
  })

  if (!res.ok) throw new Error('failed to delete data')

  const deleteRes = await res.text();
  return new NextResponse(deleteRes);
}