'use client';

import { useEffect, useState } from "react";
import { usePlaidLink } from 'react-plaid-link';
import { fetchJson } from "../../lib/fetchJson";

type Props = {
  onAccountsChange: (accountsData: Account[]) => void,
}

interface LinkTokenData {
  link_token: string;
}

export function Plaid({ onAccountsChange }: Props) {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinkToken = async () => {
      const { link_token } = await fetchJson<LinkTokenData>('/api/plaid/link-token', {
        method: 'POST'
      });
      setLinkToken(link_token);
    }

    void fetchLinkToken();
  }, []);


  const onSuccess: (publicToken: string) => void = (publicToken: string) => {
    (async () => {
      const accountsData = await fetchJson<Account[]>('/api/plaid/access-token', {
        method: 'POST',
        body: JSON.stringify({ publicToken }),
      });
  
      // update accounts list
      onAccountsChange(accountsData);
    })().catch(error => {
      console.error('Error in onSuccess call', error);
    })
  }

  const { open, ready } = usePlaidLink({
    token: linkToken!,
    onSuccess,
  });

  return (
    <button 
      className="flex-1 rounded-full bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20 border-2 hover:border-green-300"
      onClick={() => void open()}
      disabled={!ready}
    >
      Link with Plaid
    </button>
  )
}