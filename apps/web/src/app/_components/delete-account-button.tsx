'use client';

import { redirect, useRouter } from "next/navigation";

type Props = {
  accountId: string,
}

export default function DeleteAccountButton({ accountId }: Props) {
  const router = useRouter();

  const deleteAccount = async (accountId: string) => {
    const res = await fetch(`/api/accounts/${accountId}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      throw new Error('Failed to delete the data. Please try again.')
    }

    return res
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this account?')) {
      const res = await deleteAccount(accountId);
      console.log('made it here', res.ok)
      if (res.ok) {
        router.push('/dashboard');
      }
    }
  }

  return (
    <button type="button" className="bg-red-500 text-white p-2 rounded-full mt-auto" onClick={handleDelete}>Delete</button>
  )
}