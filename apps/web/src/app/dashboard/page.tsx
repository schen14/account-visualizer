"use client";

import { useState } from "react";
import { Account } from "../_components/account";

export default function Dashboard() {
  const [ activeAccount, setActiveAccount ] = useState<number>();

  const handleAccountClick = (id: number) => {
    setActiveAccount(id)
  }

  const accounts = [
    {
      "id": 1,
      "name": "Chase Checking Account",
      "accountType": "CHECKING",
      "note": "test note",
      "amount": 10000,
      "records": [
        {
          "value": 10000,
          "createdAt": '2024-03-01'
        },
        {
          "value": 9000,
          "createdAt": '2024-02-01'
        },
        {
          "value": 8000,
          "createdAt": '2024-01-01'
        }
      ]
    },
    {
      "id": 2,
      "name": "MedSurety HSA",
      "accountType": "SAVINGS",
      "note": "test note 2",
      "amount": 5000.25,
      "records": [
        {
          "value": 5000.25,
          "createdAt": '2024-03-01'
        },
        {
          "value": 5000,
          "createdAt": '2024-02-01'
        },
        {
          "value": 4900,
          "createdAt": '2024-01-01'
        }
      ]
    }
  ]

  return (
    <section>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Accounts
        </h1>
        <div className="flex justify-center space-x-4 my-5">
          <button className="flex-1 rounded-full bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20 border-2 hover:border-green-300">Add Account</button>
          <button className="flex-1 rounded-full bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20 border-2 hover:border-green-300">Import</button>
        </div>
        
        {/* AccountGroup? */}
        <div className="my-10">
          {
            accounts.map(account => (
              <Account 
                key={account.id} 
                account={account} 
                isActiveAccount={activeAccount === account.id} 
                onAccountClick={() => handleAccountClick(account.id)}
              />
            ))
          }
        </div>
        
    </section>
  
  )
}