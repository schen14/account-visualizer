import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "../../../../server/auth";
import { env } from "~/env";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } } ) {
  const session = await getServerAuthSession();
  // Issue with forwarding form data to backend, so re-construct JSON body data instead
  const formData = await request.formData();
  const bodyData = Object.fromEntries(formData)

  const res = await fetch(`${env.API_URL}/accounts/${params.id}`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user.api_access_token}`
    },
    body: JSON.stringify(bodyData),
  })

  if (!res.ok) throw new Error('failed to update data')

  const account = await res.json();

  return NextResponse.json(account);
}