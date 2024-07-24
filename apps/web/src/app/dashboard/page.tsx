"use client";

import { useEffect, useState } from "react";
import { AccountItem } from "../_components/account";
import Modal from "../_components/modal";
import { ModalContext } from "../_components/modalContext";
import { Plaid } from "../_components/plaid";

export default function Dashboard() {
  const [ accounts, setAccounts] = useState<Account[]>([]);
  const [ accountTypes, setAccountTypes] = useState<string[]>([]);
  const [ activeAccount, setActiveAccount ] = useState<Account | null>(null);
  const [ showModal, setShowModal ] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
        const fetchAccounts = fetch('api/accounts');
        const fetchAccountTypes = fetch('api/accounts/types');
        const results = await Promise.all([fetchAccounts, fetchAccountTypes]);
        const accountsData = await results[0].json();
        const accountTypesData = await results[1].json();
        setAccounts(accountsData);
        setAccountTypes(accountTypesData);
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
            onClick={() => {
              setActiveAccount(null);
              setShowModal(true)
            }}
          >
            Add Account
          </button>
          {/* <button className="flex-1 rounded-full bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20 border-2 hover:border-green-300">Import</button> */}
          <Plaid></Plaid>
        </div>
        
        {/* AccountGroup? */}
        <div className="my-10">
          <ModalContext.Provider value={{ activeAccount, setShowModal }}>
            {
              accounts.length ? 
                accounts.map(account => (
                  <AccountItem
                    key={account.id} 
                    account={account}
                    onAccountClick={() => setActiveAccount(account)}
                  />
                )) :
                "Loading..."
            }
          </ModalContext.Provider>
        </div>
        
        {showModal && <Modal activeAccount={activeAccount} accounts={accounts} accountTypes={accountTypes} onAccountsChange={setAccounts} onClose={() => setShowModal(false)}/>}
    </section>
  )
}