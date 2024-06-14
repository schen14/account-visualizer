"use client";

import { useEffect, useState } from "react";
import { AccountItem } from "../_components/account";
import Modal from "../_components/modal";

export default function Dashboard() {
  const [ accounts, setAccounts] = useState<Account[]>([]);
  const [ activeAccount, setActiveAccount ] = useState<number>();
  const [ showModal, setShowModal ] = useState<boolean>(false);

  const handleAccountClick = (id: number) => {
    setActiveAccount(id)
  }

  useEffect(() => {
    const fetchData = async () => {
        const res = await fetch('api/accounts');
        const accountsData = await res.json();
        setAccounts(accountsData);
    };

    fetchData();
  }, []);


  return (
    <section>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Accounts
        </h1>
        <div className="flex justify-center space-x-4 my-5">
          <button 
            className="flex-1 rounded-full bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20 border-2 hover:border-green-300"
            onClick={() => setShowModal(true)}
          >
            Add Account
          </button>
          <button className="flex-1 rounded-full bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20 border-2 hover:border-green-300">Import</button>
        </div>
        
        {/* AccountGroup? */}
        <div className="my-10">
          {
            accounts.length ? 
              accounts.map(account => (
                <AccountItem
                  key={account.id} 
                  account={account} 
                  isActiveAccount={activeAccount === account.id} 
                  onAccountClick={() => handleAccountClick(account.id)}
                />
              )) :
              "Loading..."
          }
        </div>
        
        {showModal && <Modal onClose={() => setShowModal(false)} accounts={accounts} onAccountsChange={setAccounts} />}
    </section>
  )
}