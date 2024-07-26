import { Dispatch, FormEvent, SetStateAction, useCallback, useState } from "react";

type Props = {
  activeAccount: Account | null,
  accountTypes: string[],
  onAccountsChange: (accountsData: Account[]) => void,
  onClose: () => void,
}

export default function Modal({ activeAccount, accountTypes, onAccountsChange, onClose }: Props) {
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<string | null>(null);

  const accFormProps = activeAccount ? {
    name: { disabled: true, defaultValue: activeAccount.name },
    type: { disabled: true, defaultValue: activeAccount.accountType },
    balance: { defaultValue: activeAccount.balance },
    note: { defaultValue: activeAccount.note }
  } : {}


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors when a new request starts

    try {
      const formData = new FormData(event.currentTarget);
      const res = activeAccount ? await updateAccount(formData) : await createAccount(formData);

      if (!res.ok) {
        throw new Error('Failed to submit the data. Please try again.')
      }
      
      const accountData = await res.json();
      onAccountsChange([accountData]);
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async (formData: FormData) => {
    return await fetch("api/accounts", {
      method: "POST",
      body: formData,
    });
  }

  const updateAccount = async (formData: FormData) => {
    if (activeAccount?.balance.toString() === formData.get('balance')) {
      formData.delete('balance');
    }
    return await fetch(`/api/accounts/${activeAccount?.id}`, {
      method: "PATCH",
      body: formData,
    });
  }

  return (
    <>
      <dialog className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-25 z-50 overflow-auto backdrop-blur-sm flex justify-center items-center text-gray-500">
        <div className="bg-white m-auto p-8 rounded-xl">
          <div className="flex flex-col items-center">
            <h3 className="text-xl">{activeAccount ? "Update Account" : "Add New Account"}</h3>
            <br/>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <label htmlFor="name" className="">Name:*</label>
              <input className="border-2 border-gray-500 rounded-md disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200" type="text" name="name" required { ...accFormProps.name }/>
              <label htmlFor="accountType" className="">Type:*</label>
              <select className="border-2 border-gray-500 rounded-md disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200" name="accountType" required { ...accFormProps.type }>
                {
                  accountTypes.map((type) => (
                    <option key={`${type}`} value={`${type}`}>{type}</option>
                  ))
                }
              </select>
              <label htmlFor="balance" className="">Current Balance:*</label>
              <input className="border-2 border-gray-500 rounded-md" type="number" name="balance" step=".01" required { ...accFormProps.balance }/>
              <label htmlFor="note" className="">Note:</label>
              <textarea className="border-2 border-gray-500 rounded-md" name="note" { ...accFormProps.note }></textarea>
              <br/>
              <button type="submit" className="bg-green-500 text-white p-2 rounded-full" disabled={isLoading}>{isLoading ? "Loading..." : "Submit"}</button>
              <br/>
              <button type="button" className="bg-red-500 text-white p-2 rounded-full" disabled={isLoading} onClick={onClose}>{isLoading ? "Loading..." : "Close"}</button>
            </form>
            
          </div>
        </div>
      </dialog>
    </>
  )
}