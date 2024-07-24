'use client';

import { useEffect, useState } from "react";
import { usePlaidLink } from 'react-plaid-link';

export function Plaid() {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinkToken = async () => {
      const response = await fetch('/api/plaid/link-token', {
        method: 'POST'
      });
      const data = await response.json();
      setLinkToken(data.link_token);
    }

    fetchLinkToken();
  }, []);


  const onSuccess = async (publicToken: string) => {
    const response = await fetch('/api/plaid/access-token', {
      method: 'POST',
      body: JSON.stringify({ publicToken }),
    });
    const data = await response.json();
    console.log('onSuccess data', data)
  }

  const { open, ready } = usePlaidLink({
    token: linkToken!,
    onSuccess,
  });


  return (
    <button 
      className="flex-1 rounded-full bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20 border-2 hover:border-green-300"
      onClick={() => open()}
      disabled={!ready}
    >
      Link with Plaid
    </button>
  )
}