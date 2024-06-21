"use client";

import { useRouter } from "next/navigation";
import { Fragment, useContext, useState } from "react";
import { AppProps } from "next/dist/shared/lib/router/router";
import { ModalContext } from "./modalContext";

interface Props {
  account: Account,
  onAccountClick: () => void
}

function formatAmount(balance: number) {
  return balance.toLocaleString('en-US', {
    'style': 'currency',
    'currency': 'USD'
  })
}

export function AccountItem({ account, onAccountClick }: Props) {
  const modalContext = useContext(ModalContext);
  const isActiveAccount = modalContext?.activeAccount?.id === account.id

  return (
    <div 
      className={`flex-col gap-4 rounded-xl my-5 transition ease-in-out cursor-pointer ${isActiveAccount ? 'bg-white text-gray-500' : 'bg-white/10 hover:bg-white hover:text-gray-500'}`}
      onClick={onAccountClick}
    >
      <h2 className="font-semibold px-4 pt-2">{account.name}</h2>
      <div className="flex-wrap px-4 py-2">
        <p className="float-right">{formatAmount(account.balance)}</p> 
        <p>{account.accountType}</p>
        
      </div>
      {
        isActiveAccount &&
          <div className="flex bg-green-300 rounded-b-xl text-center">
            <div 
              className="w-1/2 border-r border-green-500 my-1 hover: bg-white/10"
              onClick={() => {
                console.log('test Update')
                modalContext.setShowModal(true);
              }}
            >
              Update
            </div>
            <div 
              className="w-1/2 border-l border-green-500 my-1 hover: bg-white/10"
              onClick={() => console.log('test More')}
            >
              More...
            </div>
          </div>
      }
    </div>
  );
}
