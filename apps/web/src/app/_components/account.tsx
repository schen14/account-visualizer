"use client";

import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { AppProps } from "next/dist/shared/lib/router/router";

interface Props {
  account: {
    id: number,
    name: string,
    accountType: string,
    note: string,
    amount: number,
  },
  isActiveAccount: boolean,
  onAccountClick: () => void
}

function formatAmount(amount: number) {
  return amount.toLocaleString('en-US', {
    'style': 'currency',
    'currency': 'USD'
  })
}

export function Account({ account, isActiveAccount, onAccountClick }: Props) {



  return (
    <div 
      className={`flex-col gap-4 rounded-xl my-5 transition ease-in-out cursor-pointer ${isActiveAccount ? 'bg-white text-gray-500' : 'bg-white/10 hover:bg-white hover:text-gray-500'}`}
      onClick={onAccountClick}
    >
      <h2 className="font-semibold px-4 pt-2">{account.name}</h2>
      <div className="flex-wrap px-4 py-2">
        <p className="float-right">{formatAmount(account.amount)}</p> 
        <p>{account.accountType}</p>
        
      </div>
      {
        isActiveAccount &&
          <div className="flex bg-green-300 rounded-b-xl text-center">
            <div className="w-1/2 border-r border-green-500 my-1 hover: bg-white/10">Update</div>
            <div className="w-1/2 border-l border-green-500 my-1 hover: bg-white/10">More...</div>
          </div>
      }
    </div>
  );
}
